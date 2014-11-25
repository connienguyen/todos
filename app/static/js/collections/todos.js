define([
    'underscore', 
    'backbone', 
    'models/todo'
], function(_, Backbone, Todo){
      
    var Todos = Backbone.Collection.extend({

	// Reference the model corresponding with the collection
	model: Todo,

	url: '/todos/',

	// Filter list of models in collection to those that are done
	done: function() {
	    return this.filter(function(todo){ return todo.get('done'); });
	},

	// Filter list of models in collection to those not done
	remaining: function() {
	    return this.without.apply(this, this.done());
	},

	// Keep the Todo models in order of insertion. Indexes at 0
	// to match jQuery <li> index
	nextOrder: function() {
	    if (!this.length) return 0;
	    return this.last().get('order') + 1;
	},

	// Function to keep models in insertion order
	comparator: function(todo) {
	    return todo.get('order');
	}
    });

  return new Todos;
});

