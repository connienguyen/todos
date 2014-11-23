define([
    'underscore', 
    'backbone', 
    'backboneLocalstorage', 
    'models/todo'
], function(_, Backbone, Store, Todo){
      
    var Todos = Backbone.Collection.extend({

	// Reference the model corresponding with the collection
	model: Todo,

	// Save under the 'todos' namespace
	localStorage: new Store("todos"),

	// Filter list of models in collection to those that are done
	done: function() {
	    return this.filter(function(todo){ return todo.get('done'); });
	},

	// Filter list of models in collection to those not done
	remaining: function() {
	    return this.without.apply(this, this.done());
	},

	// Keep the Todo models in order of insertion
	nextOrder: function() {
	    if (!this.length) return 1;
	    return this.last().get('order') + 1;
	},

	// Function to keep models in insertion order
	comparator: function(todo) {
	    return todo.get('order');
	}
    });

  return new Todos;
});

