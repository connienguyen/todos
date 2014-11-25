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

	// Maintain a list of TodoViews
	viewTodos: [],

	// Stats template to appear at bottom of the app
	statsTemplate: _.template(statsTemplate),

	// Events for creating and clearing Todos
	events: {
	    "keypress #new-todo":	"createOnEnter",
	    "click .todo-clear a":	"clearCompleted",
	    "click #todo-button":	"createOnClick",
	    "click .todo-markall a":	"markAllCompleted",
	    "click .clear-completed a":	"clearCompleted",
	    "listupdate":		"listUpdate"
	},

	// Bind relevents events on the Todos collection when items are added
	// or changed. Start by loading any already existing todos from
	// localStorage
	initialize: function() {
	    _.bindAll(this, 'addOne', 'addAll', 'render', 'listUpdate');

	    this.input = this.$("#new-todo");

	    // Initialize jquery ui sortable plugin
	    var view = this;
	    this.$("#todo-list").sortable({
		placeholder: "sortable-placeholder",
		update: function(e, ui) {
		    view.listUpdate();
		}
	    });

	    Todos.bind('add',     this.addOne);
	    Todos.bind('reset',   this.addAll);
	    Todos.bind('all',     this.render);
	},

	// Refreshing the statistics on the bottom of the App
	render: function() {
	    this.$('#todo-stats').html(this.statsTemplate({
		total: Todos.length,
		done: Todos.done().length,
		remaining: Todos.remaining().length
	    }));
	},

	// Add a single todo to the list by create a view for it and
	// appending it to the #todo-list
	addOne: function(todo) {
	    var view = new TodoView({model: todo});
	    this.$("#todo-list").append(view.render().el);
	    this.viewTodos.push(view);
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

	// On the event that the keypress is Enter, create a new Todo. Also
	// check that the input is not empty
	createOnEnter: function(e) {
	    if (e.keyCode != 13 || !this.input.val().trim()) return;
	    Todos.create(this.newAttributes());
	    this.input.val('');
	},

	// Adds new todo item on button click if input is not empty
	createOnClick: function() {
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

	// Updates the list of sortable items
	listUpdate: function() {

	    var view = this;
	    _.each(this.viewTodos, function(todoview) {
		// todoview has been removed from viewTodos
		if(typeof todoview === 'undefined') {
		    return true;
		};
	    
		var orderNew = todoview.$el.index();
		var orderOld = todoview.model.get('order');

		// This item has been removed from the list!
		// Remove item from viewTodos go to next iteration
		if(orderNew < 0) {
		    var index = view.viewTodos.indexOf(todoview);
		    view.viewTodos.splice(index, 1);
		    return true;
		}

		// Try to reduce the number of PUT requests
		if(orderNew != orderOld) {
		    todoview.model.save(
			{order: todoview.$el.index()},
			{put: true});
		} 
	    });

	    Todos.sort({silent:true});
	}
  });

    return AppView;
});

