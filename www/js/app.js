// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'Devise'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, AuthProvider, AuthInterceptProvider) {

    $ionicConfigProvider.views.maxCache(0);

    // DEVISE
    AuthProvider.loginMethod('POST');
    AuthProvider.loginPath('http://localhost:3000/users/sign_in.json');

    // Customize logout
    AuthProvider.logoutMethod('DELETE');
    AuthProvider.logoutPath('http://localhost:3000/users/sign_out.json');

    // Customize register
    AuthProvider.registerMethod('POST');
    AuthProvider.registerPath('http://localhost:3000/users.json');

    //AuthProvider.resourceName('user');

    // Intercept 401 Unauthorized everywhere
    // Enables `devise:unauthorized` interceptor
    AuthInterceptProvider.interceptAuth(true);


    $stateProvider

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html'
    })

    .state('sign-in', {
        url: '/sign-in',
        templateUrl: 'templates/sign-in.html'
    })

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })


    // Timeline Agenda

    .state('app.timeline', {
        url: '/timeline',
        views: {
            'menuContent': {
                templateUrl: 'templates/timeline.html'
            }
        }
    })


    // Person Agenda

    .state('app.person', {
        url: '/person',
        views: {
            'menuContent': {
                templateUrl: 'templates/person.html'
            }
        }
    })

    .state('app.person_add', {
        url: '/person_add',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_add.html',

            }
        }
    })

    .state('app.person_view', {
        url: '/person_view',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_view.html',
                controller: 'itemPersonCtrl',

            }
        }
    })

    .state('app.item_person', {
        url: '/person/item_person/:person_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/item_person.html',
            }
        }
    })

    .state('app.person_date', {
        url: '/person/person_date/:person_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_date.html'
            }
        }
    })

    .state('app.person_date_form', {
        url: '/person_date_form/new/:person_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_date_form.html',
                controller: 'itemPersonCtrl',

            }
        }
    })

    .state('app.person_date_view', {
        url: '/person_date_view/:reminder_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_date_view.html'
            }
        }
    })

    .state('app.person_food', {
        url: '/person/person_food/:person_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_food.html'            }
        }
    })

    .state('app.person_food_form', {
        url: '/person_food_form/new/:person_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_food_form.html',
                controller: 'itemPersonCtrl',

            }
        }
    })

    .state('app.person_food_view', {
        url: '/person_food_view/:food_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_food_view.html'
            }
        }
    })



    .state('app.person_place', {
        url: '/person/person_place/:person_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_place.html'            }
        }
    })

    .state('app.person_place_form', {
        url: '/person_place_form/new/:person_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_place_form.html'
            }
        }
    })

    .state('app.person_place_view', {
        url: '/person_place_view/:place_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_place_view.html'
            }
        }
    })



    .state('app.person_present', {
        url: '/person/person_present/:person_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_present.html'
            }
        }
    })

    .state('app.person_present_form', {
        url: '/person_present_form/new/:person_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_present_form.html'
            }
        }
    })

     .state('app.person_present_view', {
        url: '/person_present_view/:interest_id',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_present_view.html'
            }
        }
    })



.state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'profileCtrl'
            }
        }
    })













    .state('app.photo', {
        url: '/photo',
        views: {
            'menuContent': {
                templateUrl: 'templates/photo.html',
                controller: 'sendPicCtrl'
            }
        }
    })



    // .state('app.item_profile', {
    //     url: '/person/:item_profileId',
    //     views: {
    //         'menuContent': {
    //             templateUrl: 'templates/item_profile.html',
    //             controller: 'itemProfileCtrl',

    //         }
    //     }
    // })








    // .state('app.playlists', {
    //     url: '/playlists',
    //     views: {
    //         'menuContent': {
    //             templateUrl: 'templates/playlists.html',
    //             controller: 'PlaylistsCtrl'
    //         }
    //     }
    // })

    // .state('app.single', {
    //     url: '/playlists/:playlistId',
    //     views: {
    //         'menuContent': {
    //             templateUrl: 'templates/playlist.html',
    //             controller: 'PlaylistCtrl'
    //         }
    //     }
    // });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
});
