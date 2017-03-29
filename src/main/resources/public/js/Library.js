// Require.js allows us to configure shortcut alias
requirejs.config({
    baseUrl: '/js',
    paths: {
        text: 'lib/text',
        jquery: 'lib/jquery',
        i18n: 'lib/jquery.i18n.properties',
        underscore: 'lib/underscore',
        backbone: 'lib/backbone'
    },
    shim: {
        i18n: {
            deps :['jquery']
        }
    }
});

define(function(require) {
    'use strict';

    require('i18n');
    jQuery.i18n.properties({
        name:'Messages',
        path:'/js/bundle/',
        mode:'map',
        checkAvailableLanguages: true,
        async: true,
        callback: function() {
            var LibraryRouter = require('routers/LibraryRouter');
            new LibraryRouter();
            Backbone.history.start({
                pushState: true,
            });
        }
    });
});
