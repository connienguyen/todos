define([
    'jquery', 
    'underscore', 
    'backbone',
    'text!templates/todos.html'
], function($, _, Backbone, todosTemplate){

    var TodoView = Backbone.View.extend({

	// TodoView is a <li>	
	tagName:  "li",

	// Assign template for individual view
	template: _.template(todosTemplate),

	// Event handling for updating and removing a view
	events: {
	    "click .check"              : "toggleDone",
	    "dblclick div.todo-content" : "edit",
	    "click span.todo-destroy"   : "clear",
	    "keypress .todo-input"      : "updateOnEnter"
	},

	// Initialize a one-to-one correspondence between a Todo model and
	// TodoView
	initialize: function() {
	    _.bindAll(this, 'render', 'close');
	    this.model.bind('change', this.render);
	    this.model.view = this;
	},

	// Re-render contents of Todo (because it was added or updated)
	render: function() {
	    $(this.el).html(this.template(this.model.toJSON()));
	    this.setContent();
	    return this;
	},

	// Avoid XSS using $.text to set the contents of Todo
	setContent: function() {
	    var content = this.model.get('content');
	    this.$('.todo-content').text(content);
	    this.input = this.$('.todo-input');
	    this.input.bind('blur', this.close);
	    this.input.val(content);
	},

	// Toggle 'done' of this.model
	toggleDone: function() {
	    this.model.toggle();
	},

	// Switch the view into 'editing' mode which has an input field
	edit: function() {
	    $(this.el).addClass("editing");
	    this.input.focus();
	},

	// Exit out of 'editing' mode and save changes to this.model Todo
	close: function() {
	    this.model.save({content: this.input.val()});
	    $(this.el).removeClass("editing");
	},

	// On Enter keypress, save changes to editing item
	updateOnEnter: function(e) {
	    if (e.keyCode == 13) this.close();
	},

	// Remove this view
	remove: function() {
	    $(this.el).remove();
	},

	// Destory the model
	clear: function() {
	    this.model.clear();
	}
    });

    return TodoView;
});

