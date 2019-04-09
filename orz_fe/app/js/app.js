'use strict';

var app = angular.module('xenon-app', [
    'ngCookies',

    'ui.router',
    'ui.bootstrap',

    'oc.lazyLoad',

    'xenon.controllers',
    'xenon.directives',
    'xenon.factory',
    'xenon.services',

    // Added in v1.3
    'FBAngular'
]);

app.run(function () {
    // Page Loading Overlay
    public_vars.$pageLoadingOverlay = jQuery('.page-loading-overlay');

    jQuery(window).load(function () {
        public_vars.$pageLoadingOverlay.addClass('loaded');
    })
});


app.config(function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, ASSETS) {

    $urlRouterProvider.otherwise('/login');

    $stateProvider.// Main Layout Structure
    state('app', {
        abstract: true,
        url: '/app',
        templateUrl: appHelper.templatePath('layout/app-body'),
        controller: function ($rootScope) {
            $rootScope.isLoginPage = false;
            $rootScope.isLightLoginPage = false;
            $rootScope.isLockscreenPage = false;
            $rootScope.isMainPage = true;
        }
    }).// Dashboards
    state('app.dashboard-variant-1', {
        url: '/dashboard-variant-1',
        templateUrl: appHelper.templatePath('dashboards/variant-1'),
        resolve: {
            resources: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.charts.dxGlobalize,
                    ASSETS.extra.toastr,
                ]);
            },
            dxCharts: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.charts.dxCharts,
                ]);
            },
        }
    }).state('app.dashboard-variant-2', {
        url: '/dashboard-variant-2',
        templateUrl: appHelper.templatePath('dashboards/variant-2'),
        resolve: {
            resources: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.charts.dxGlobalize,
                ]);
            },
            dxCharts: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.charts.dxCharts,
                ]);
            },
        }
    }).state('app.dashboard-variant-3', {
        url: '/dashboard-variant-3',
        templateUrl: appHelper.templatePath('dashboards/variant-3'),
        resolve: {
            resources: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.charts.dxGlobalize,
                    ASSETS.maps.vectorMaps,
                ]);
            },
            dxCharts: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.charts.dxCharts,
                ]);
            },
        }
    }).state('app.dashboard-variant-4', {
        url: '/dashboard-variant-4',
        templateUrl: appHelper.templatePath('dashboards/variant-4'),
        resolve: {
            resources: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.icons.meteocons,
                    ASSETS.maps.vectorMaps,
                ]);
            }
        }
    }).// Update Highlights
    state('app.update-highlights', {
        url: '/update-highlights',
        templateUrl: appHelper.templatePath('update-highlights'),
    }).// Layouts
    state('app.layout-and-skins', {
        url: '/layout-and-skins',
        templateUrl: appHelper.templatePath('layout-and-skins'),
    }).// UI Elements
    state('app.ui-panels', {
        url: '/ui-panels',
        templateUrl: appHelper.templatePath('ui/panels'),
    }).state('app.ui-buttons', {
        url: '/ui-buttons',
        templateUrl: appHelper.templatePath('ui/buttons')
    }).state('app.ui-tabs-accordions', {
        url: '/ui-tabs-accordions',
        templateUrl: appHelper.templatePath('ui/tabs-accordions')
    }).state('app.ui-modals', {
        url: '/ui-modals',
        templateUrl: appHelper.templatePath('ui/modals'),
        controller: 'UIModalsCtrl'
    }).state('app.ui-breadcrumbs', {
        url: '/ui-breadcrumbs',
        templateUrl: appHelper.templatePath('ui/breadcrumbs')
    }).state('app.ui-blockquotes', {
        url: '/ui-blockquotes',
        templateUrl: appHelper.templatePath('ui/blockquotes')
    }).state('app.ui-progress-bars', {
        url: '/ui-progress-bars',
        templateUrl: appHelper.templatePath('ui/progress-bars')
    }).state('app.ui-navbars', {
        url: '/ui-navbars',
        templateUrl: appHelper.templatePath('ui/navbars')
    }).state('app.ui-alerts', {
        url: '/ui-alerts',
        templateUrl: appHelper.templatePath('ui/alerts')
    }).state('app.ui-pagination', {
        url: '/ui-pagination',
        templateUrl: appHelper.templatePath('ui/pagination')
    }).state('app.ui-typography', {
        url: '/ui-typography',
        templateUrl: appHelper.templatePath('ui/typography')
    }).state('app.ui-other-elements', {
        url: '/ui-other-elements',
        templateUrl: appHelper.templatePath('ui/other-elements')
    }).// // Widgets
    // state('app.widgets', {
    //     url: '/widgets',
    //     templateUrl: appHelper.templatePath('widgets'),
    //     resolve: {
    //         deps: function ($ocLazyLoad) {
    //             return $ocLazyLoad.load([
    //                 ASSETS.maps.vectorMaps,
    //                 ASSETS.icons.meteocons
    //             ]);
    //         }
    //     }
    // }).// Mailbox
    // state('app.mailbox-inbox', {
    //     url: '/mailbox-inbox',
    //     templateUrl: appHelper.templatePath('mailbox/inbox'),
    // }).state('app.mailbox-compose', {
    //     url: '/mailbox-compose',
    //     templateUrl: appHelper.templatePath('mailbox/compose'),
    //     resolve: {
    //         bootstrap: function ($ocLazyLoad) {
    //             return $ocLazyLoad.load([
    //                 ASSETS.core.bootstrap,
    //             ]);
    //         },
    //         bootstrapWysihtml5: function ($ocLazyLoad) {
    //             return $ocLazyLoad.load([
    //                 ASSETS.forms.bootstrapWysihtml5,
    //             ]);
    //         },
    //     }
    // }).state('app.mailbox-message', {
    //     url: '/mailbox-message',
    //     templateUrl: appHelper.templatePath('mailbox/message'),
    // }).// Tables
    // state('app.tables-basic', {
    //     url: '/tables-basic',
    //     templateUrl: appHelper.templatePath('tables/basic'),
    // }).state('app.tables-responsive', {
    //     url: '/tables-responsive',
    //     templateUrl: appHelper.templatePath('tables/responsive'),
    //     resolve: {
    //         deps: function ($ocLazyLoad) {
    //             return $ocLazyLoad.load([
    //                 ASSETS.tables.rwd,
    //             ]);
    //         }
    //     }
    // }).state('app.tables-datatables', {
    //     url: '/tables-datatables',
    //     templateUrl: appHelper.templatePath('tables/datatables'),
    //     resolve: {
    //         deps: function ($ocLazyLoad) {
    //             return $ocLazyLoad.load([
    //                 ASSETS.tables.datatables,
    //             ]);
    //         },
    //     }
    // }).
    // Forms
    state('app.forms-native', {
        url: '/forms-native',
        templateUrl: appHelper.templatePath('forms/native-elements'),
    }).state('app.forms-input-masks', {
        url: '/forms-input-masks',
        templateUrl: appHelper.templatePath('forms/input-masks'),
        resolve: {
            inputmask: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.forms.inputmask,
                ]);
            },
        },
    }).state('app.forms-models-check', {
        url: '/forms-models-check',
        templateUrl: appHelper.templatePath('forms/models-check'),
        resolve: {
            dropzone: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.forms.dropzone,
                ]);
            },
        }
    }).state('app.forms-models-list', {
        url: '/forms-models-list',
        templateUrl: appHelper.templatePath('forms/models-list'),
        resolve: {
            deps: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.tables.datatables,
                ]);
            },
        }
    }).state('app.forms-sliders', {
        url: '/forms-sliders',
        templateUrl: appHelper.templatePath('forms/sliders'),
        resolve: {
            sliders: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.core.jQueryUI,
                ]);
            },
        },
    }).state('app.forms-icheck', {
        url: '/forms-icheck',
        templateUrl: appHelper.templatePath('forms/icheck'),
        resolve: {
            iCheck: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.forms.icheck,
                ]);
            },
        }
    }).// Extra
    state('app.extra-icons-font-awesome', {
        url: '/extra-icons-font-awesome',
        templateUrl: appHelper.templatePath('extra/icons-font-awesome'),
        resolve: {
            fontAwesome: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.core.jQueryUI,
                    ASSETS.extra.tocify,
                ]);
            },
        }
    }).//v注册
    state('reg', {
        url: '/reg',
        templateUrl: appHelper.templatePath('reg'),
        controller: 'RegCtrl',
        resolve: {
            resources: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.forms.jQueryValidate,
                    ASSETS.extra.toastr,
                ]);
            },
        }
    }).// Logins and Lockscreen
    state('login', {
        url: '/login',
        templateUrl: appHelper.templatePath('login'),
        controller: 'LoginCtrl',
        resolve: {
            resources: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.forms.jQueryValidate,
                    ASSETS.extra.toastr,
                ]);
            },
        }
    }).state('lockscreen', {
        url: '/lockscreen',
        templateUrl: appHelper.templatePath('lockscreen'),
        controller: 'LockscreenCtrl',
        resolve: {
            resources: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    ASSETS.forms.jQueryValidate,
                    ASSETS.extra.toastr,
                ]);
            },
        }
    });
});


app.constant('ASSETS', {
    'core': {
        'bootstrap': appHelper.assetPath('js/bootstrap.min.js'), // Some plugins which do not support angular needs this

        'jQueryUI': [
            appHelper.assetPath('js/jquery-ui/jquery-ui.min.js'),
            appHelper.assetPath('js/jquery-ui/jquery-ui.structure.min.css'),
        ],

        'moment': appHelper.assetPath('js/moment.min.js'),

        'googleMapsLoader': appHelper.assetPath('app/js/angular-google-maps/load-google-maps.js')
    },

    'charts': {

        'dxGlobalize': appHelper.assetPath('js/devexpress-web-14.1/js/globalize.min.js'),
        'dxCharts': appHelper.assetPath('js/devexpress-web-14.1/js/dx.chartjs.js'),
        'dxVMWorld': appHelper.assetPath('js/devexpress-web-14.1/js/vectormap-data/world.js'),
    },

    'xenonLib': {
        notes: appHelper.assetPath('js/xenon-notes.js'),
    },

    'maps': {

        'vectorMaps': [
            appHelper.assetPath('js/jvectormap/jquery-jvectormap-1.2.2.min.js'),
            appHelper.assetPath('js/jvectormap/regions/jquery-jvectormap-world-mill-en.js'),
            appHelper.assetPath('js/jvectormap/regions/jquery-jvectormap-it-mill-en.js'),
        ],
    },

    'icons': {
        'meteocons': appHelper.assetPath('css/fonts/meteocons/css/meteocons.css'),
        'elusive': appHelper.assetPath('css/fonts/elusive/css/elusive.css'),
    },

    'tables': {
        'rwd': appHelper.assetPath('js/rwd-table/js/rwd-table.min.js'),

        'datatables': [
            appHelper.assetPath('js/datatables/dataTables.bootstrap.css'),
            appHelper.assetPath('js/datatables/datatables-angular.js'),
        ],

    },

    'forms': {

        'select2': [
            appHelper.assetPath('js/select2/select2.css'),
            appHelper.assetPath('js/select2/select2-bootstrap.css'),

            appHelper.assetPath('js/select2/select2.min.js'),
        ],


        'daterangepicker': [
            appHelper.assetPath('js/daterangepicker/daterangepicker-bs3.css'),
            appHelper.assetPath('js/daterangepicker/daterangepicker.js'),
        ],

        'colorpicker': appHelper.assetPath('js/colorpicker/bootstrap-colorpicker.min.js'),

        'selectboxit': appHelper.assetPath('js/selectboxit/jquery.selectBoxIt.js'),

        'tagsinput': appHelper.assetPath('js/tagsinput/bootstrap-tagsinput.min.js'),

        'datepicker': appHelper.assetPath('js/datepicker/bootstrap-datepicker.js'),

        'timepicker': appHelper.assetPath('js/timepicker/bootstrap-timepicker.min.js'),

        'inputmask': appHelper.assetPath('js/inputmask/jquery.inputmask.bundle.js'),

        'formWizard': appHelper.assetPath('js/formwizard/jquery.bootstrap.wizard.min.js'),

        'jQueryValidate': appHelper.assetPath('js/jquery-validate/jquery.validate.min.js'),

        'dropzone': [
            appHelper.assetPath('js/dropzone/css/dropzone.css'),
            appHelper.assetPath('js/dropzone/dropzone.min.js'),
        ],

        'typeahead': [
            appHelper.assetPath('js/typeahead.bundle.js'),
            appHelper.assetPath('js/handlebars.min.js'),
        ],

        'multiSelect': [
            appHelper.assetPath('js/multiselect/css/multi-select.css'),
            appHelper.assetPath('js/multiselect/js/jquery.multi-select.js'),
        ],

        'icheck': [
            appHelper.assetPath('js/icheck/skins/all.css'),
            appHelper.assetPath('js/icheck/icheck.min.js'),
        ],

        'bootstrapWysihtml5': [
            appHelper.assetPath('js/wysihtml5/src/bootstrap-wysihtml5.css'),
            appHelper.assetPath('js/wysihtml5/wysihtml5-angular.js')
        ],
    },

    'uikit': {
        'base': [
            appHelper.assetPath('js/uikit/uikit.css'),
            appHelper.assetPath('js/uikit/css/addons/uikit.almost-flat.addons.min.css'),
            appHelper.assetPath('js/uikit/js/uikit.min.js'),
        ],

        'codemirror': [
            appHelper.assetPath('js/uikit/vendor/codemirror/codemirror.js'),
            appHelper.assetPath('js/uikit/vendor/codemirror/codemirror.css'),
        ],

        'marked': appHelper.assetPath('js/uikit/vendor/marked.js'),
        'htmleditor': appHelper.assetPath('js/uikit/js/addons/htmleditor.min.js'),
        'nestable': appHelper.assetPath('js/uikit/js/addons/nestable.min.js'),
    },

    'extra': {
        'tocify': appHelper.assetPath('js/tocify/jquery.tocify.min.js'),

        'toastr': appHelper.assetPath('js/toastr/toastr.min.js'),

        'fullCalendar': [
            appHelper.assetPath('js/fullcalendar/fullcalendar.min.css'),
            appHelper.assetPath('js/fullcalendar/fullcalendar.min.js'),
        ],

        'cropper': [
            appHelper.assetPath('js/cropper/cropper.min.js'),
            appHelper.assetPath('js/cropper/cropper.min.css'),
        ]
    }
});