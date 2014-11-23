'use strict';

require.config({
    shim: {
	underscore: {
	    exports: '_'
	},
	backbone: {
	    deps: [
		'underscore',
		'jquery'
	    ],
	    exports: 'Backbone'
	},
	backboneLocalstorage: {
	    deps: ['backbone'],
	    exports: 'Store'
	}
    },
    paths: {
	jquery: '../bower_components/jquery/dist/jquery',
	jquerySortable: '../bower_components/html5sortable/jquery.sortable',
	underscore: '../bower_components/underscore/underscore',
	backbone: '../bower_components/backbone/backbone',
	backboneLocalstorage: '../bower_components/backbone.localStorage/backbone.localStorage',
	text: '../bower_components/requirejs-text/text'
    }
});

require([
    'views/app'
], function (AppView) {

    // Initialize application view
    new AppView();
});
