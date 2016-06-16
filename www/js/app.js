// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

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

.config(function($stateProvider, $urlRouterProvider) {


    $stateProvider

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    })

    .state('sign-in', {
        url: '/sign-in',
        templateUrl: 'templates/sign-in.html',
        controller: 'loginCtrl'
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
                templateUrl: 'templates/timeline.html',
                controller: 'TimelineCtrl'
            }
        }
    })


    // Person Agenda

    .state('app.person', {
        url: '/person',
        views: {
            'menuContent': {
                templateUrl: 'templates/person.html',
                controller: 'PersonCtrl'
            }
        }
    })

    .state('app.person_add', {
        url: '/person_add',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_add.html',
                controller: 'itemPersonCtrl',

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
        url: '/person/item_person',
        views: {
            'menuContent': {
                templateUrl: 'templates/item_person.html',
                controller: 'itemPersonCtrl',

            }
        }
    })

    .state('app.person_date', {
        url: '/person/person_date',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_date.html',
                controller: 'itemPersonCtrl',

            }
        }
    })

    .state('app.person_date_form', {
        url: '/person_date_form',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_date_form.html',
                controller: 'itemPersonCtrl',

            }
        }
    })

    .state('app.person_date_view', {
        url: '/person_date_view',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_date_view.html',
                controller: 'itemPersonCtrl',

            }
        }
    })

    .state('app.person_food', {
        url: '/person/person_food',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_food.html',
                controller: 'itemPersonCtrl',

            }
        }
    })

    .state('app.person_food_form', {
        url: '/person_food_form',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_food_form.html',
                controller: 'itemPersonCtrl',

            }
        }
    })

    .state('app.person_food_view', {
        url: '/person_food_view',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_food_view.html',
                controller: 'itemPersonCtrl',

            }
        }
    })



    .state('app.person_place', {
        url: '/person/person_place',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_place.html',
                controller: 'itemPersonCtrl',

            }
        }
    })

    .state('app.person_place_form', {
        url: '/person_place_form',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_place_form.html',
                controller: 'itemPersonCtrl',

            }
        }
    })

    .state('app.person_place_view', {
        url: '/person_place_view',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_place_view.html',
                controller: 'itemPersonCtrl',

            }
        }
    })



    .state('app.person_present', {
        url: '/person/person_present',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_present.html',
                controller: 'itemPersonCtrl',

            }
        }
    })

    .state('app.person_present_form', {
        url: '/person_present_form',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_present_form.html',
                controller: 'itemPersonCtrl',

            }
        }
    })

     .state('app.person_present_view', {
        url: '/person_present_view',
        views: {
            'menuContent': {
                templateUrl: 'templates/person_present_view.html',
                controller: 'itemPersonCtrl',

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
