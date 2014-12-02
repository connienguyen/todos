define([
    'jquery',
    'underscore', 
    'backbone',
    'collections/todos',
    'views/todos',
    'text!templates/stats.html',
    'jqueryUI'
], function($, _, Backbone, Todos, TodoView, statsTemplate){
    
    var AppView = Backbone.View.extend({

	// Bind view to #todoapp in HTML
	el: $("#todoapp"),

	// Stats template to appear at bottom of the app
	statsTemplate: _.template(statsTemplate),

	// Events for creating and clearing Todos
	events: {
	    "keypress #new-todo"	: "createTodo",
	    "click .todo-clear a"	: "clearCompleted",
	    "click #todo-button"	: "createTodo",
	    "click .todo-markall a"	: "markAllCompleted",
	    "click .clear-completed a"	: "clearCompleted",
	    "update-sort"		: "updateSort"
	},

	// Bind relevents events on the Todos collection when items are added
	// or changed. Start by loading any already existing todos from
	// localStorage
	initialize: function() {
	    //Bind functions to view
	    _.bindAll(this, 'addOne', 'addAll', 'render');

	    this.input = this.$("#new-todo");

	    // Initialize jquery ui sortable plugin
	    var view = this;
	    this.$("#todo-list").sortable({
		placeholder: "sortable-placeholder",
		start: function(e, ui) {
		    ui.item.addClass("sortable-draggable");
		    ui.item.find(".todo-destroy").hide();
		    ui.item.find(".todo-content").after('<span class="todo-drag"></span>');
		},
		stop: function(e, ui) {
		    ui.item.find(".todo-drag").remove();
		    ui.item.find(".todo-destroy").show();
		    ui.item.removeClass("sortable-draggable");
		    ui.item.trigger('drop', ui.item.index());
		}
	    });

	    Todos.bind('add',     this.addOne);
	    Todos.bind('reset',   this.addAll);
	    Todos.bind('all',     this.render);

	    // Initial render if user's first visit to page
	    this.render();
	},

	// Refreshing the statistics on the bottom of the App
	render: function() {
	    this.$('#todo-stats').html(this.statsTemplate({
		total: Todos.length,
		done: Todos.done().length,
		remaining: Todos.remaining().length
	    }));

	    this.$("#todo-list").children().remove();
	    Todos.each(this.addOne, this);
	    return this;
	},

	// Add a single todo to the list by create a view for it and
	// appending it to the #todo-list
	addOne: function(todo) {
	    var view = new TodoView({model: todo});
	    this.$("#todo-list").append(view.render().el);
	},

	// Add all items in Todos at once
	addAll: function() {
	    Todos.each(this.addOne);
	},

	// Create attributes for a new Todo item (whenever a new one is added)
	newAttributes: function() {
	    return {
		content: this.input.val(),
		order: Todos.nextOrder(),
		done: false
	    };
	},

	// On the event that the event was a click on #new-todo or an
	// Enter keypress, create a new Todo. Also check that input is not
	// empty
	createTodo: function(e) {
		if( e.type == "keypress") {
			if (e.keyCode != 13) return;
		}
		if(!this.input.val().trim()) return;
	    Todos.create(this.newAttributes());
	    this.input.val('');
	},

	// Clear all done todo items by destroying their models
	clearCompleted: function() {
	    _.each(Todos.done(), function(todo){ todo.clear(); });
	    return false;
	},

	// Mark all items completed
	markAllCompleted: function() {
	    _.each(Todos.remaining(), function(todo) {todo.toggle();});
	    return false;
	},

	// Updates the list of sortable items without using additional array
	updateSort: function(e, model, position) {
	    Todos.remove(model);

	    // Shifts order of items in collection down if past position 
	    Todos.each(function(model, index) {
		var orderNew = index;
		if( index >= position) {
		    orderNew += 1;
		}
		// Only update if order is not the same
		if( orderNew != model.get('order')) {
		    model.save({order: orderNew}, {put: true});
		}
	    });

	    // Finally add dragged & dropped model to its new position
	    Todos.add(model, {at: position});
	    model.save({order: position}, {put: true});	    

	    this.render();
	    this.$("#todo-list").sortable("option", "disabled", false);
	}
  });

    return AppView;
});

