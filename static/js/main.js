'use strict';

require.config({
    shim: {
	underscore: {
	    exports: '_'
	},
	backbone: {
	    deps: [
		'underscore',
		'jquery',
		'jqueryUI'
	    ],
	    exports: 'Backbone'
	},
    },
    paths: {
	jquery: '../bower_components/jquery/dist/jquery',
	jquerySortable: '../bower_components/html5sortable/jquery.sortable',
	jqueryUI: '../bower_components/jquery-ui/jquery-ui',
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
