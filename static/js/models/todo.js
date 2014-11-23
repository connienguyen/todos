define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var Todo = Backbone.Model.extend({

	// Default attributes for the todo.
	defaults: {
	    content: "",
	    done: false
	},

	// Toggle 'done' of Todo
	toggle: function() {
	    this.save({done: !this.get("done")});
	},

	// Remove Todo from localStorage and remove its view
	clear: function() {
	    this.destroy();
	    this.view.remove();
	}
    });

  return Todo;
});

