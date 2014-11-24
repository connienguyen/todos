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
	}
    },
    paths: {
	jquery: '../bower_components/jquery/dist/jquery',
	jquerySortable: '../bower_components/html5sortable/jquery.sortable',
	underscore: '../bower_components/underscore/underscore',
	backbone: '../bower_components/backbone/backbone',
	text: '../bower_components/requirejs-text/text'
    }
});

require([
    'jquery',
    'views/app'
], function ($,AppView) {

    // Initialize application view
    var appView = new AppView();

    // Fix to get the bottom stats to appear on first load
    $(document).ready(appView.render);
});
