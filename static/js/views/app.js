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
	    "keypress #new-todo":	"createOnEnter",
	    "click .todo-clear a":	"clearCompleted",
	    "click #todo-button":	"createOnClick",
	    "click .todo-markall a":	"markAllCompleted",
	    "click .clear-completed a":	"clearCompleted",
	    "listupdate":		"listUpdate"
	},

	// Bind relevents on the Todos collection when items are added
	// or changed. Start by loading any already existing todos from
	// localStorage
	initialize: function() {
	    _.bindAll(this, 'addOne', 'addAll', 'render');

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
	    Todos.each(function(todo) {
		//should update order in here	
	    });	    
	    Todos.sort({silent: true});
	    this.render();
	}
  });

    return AppView;
});

