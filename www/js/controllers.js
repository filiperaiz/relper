angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $stateParams) {})


// LOGIN CONTROLLER

.controller('loginCtrl', function($scope, $state, $ionicLoading, Auth, $window, $ionicPopup, Util /*, $cordovaFacebook*/) {

    $scope.activeTemplate = 'login';
    $scope.user = {};

    if (Util.logged()) {
        $state.go('app.person');
    }

    $scope.loginFacebook = function() {
        alert('Entrou');
/*
        //Browser Login
        if (!(ionic.Platform.isIOS() || ionic.Platform.isAndroid())) {

            Parse.FacebookUtils.logIn(null, {
                success: function(user) {
                    console.log(user);
                    if (!user.existed()) {
                        alert("User signed up and logged in through Facebook!");
                    } else {
                        alert("User logged in through Facebook!");
                    }
                },
                error: function(user, error) {
                    alert("User cancelled the Facebook login or did not fully authorize.");
                }
            });

        }
        //Native Login
        else {

            $cordovaFacebook.login(["public_profile", "email"]).then(function(success) {

                console.log(success);

                //Need to convert expiresIn format from FB to date
                var expiration_date = new Date();
                expiration_date.setSeconds(expiration_date.getSeconds() + success.authResponse.expiresIn);
                expiration_date = expiration_date.toISOString();

                var facebookAuthData = {
                    "id": success.authResponse.userID,
                    "access_token": success.authResponse.accessToken,
                    "expiration_date": expiration_date
                };

                Parse.FacebookUtils.logIn(facebookAuthData, {
                    success: function(user) {
                        console.log(user);
                        if (!user.existed()) {
                            alert("User signed up and logged in through Facebook!");
                        } else {
                            alert("User logged in through Facebook!");
                        }
                    },
                    error: function(user, error) {
                        alert("User cancelled the Facebook login or did not fully authorize.");
                    }
                });

            }, function(error) {
                console.log(error);
            });

        }*/
    };


    $scope.create_user = function() {
        alert('Entrou 1');
        $ionicLoading.show({
            template: 'Aguarde'
        });

        alert('Entrou 2');

        var credentials = {
            name: $scope.user.name,
            email: $scope.user.email,
            password: $scope.user.password,
            password_confirmation: $scope.user.password_confirmation
        };

        alert('Entrou 3');

        var config = {
            headers: {
                'X-HTTP-Method-Override': 'POST'
            }
        };

        alert('Entrou 4');

        Auth.register(credentials, config).then(function(registeredUser) {}, function(error) {
            message = '';
            if (typeof error.data.errors.name != 'undefined') {
                message += '<li>' + error.data.errors.name + '</li>'
            }
            if (typeof error.data.errors.email != 'undefined') {
                message += '<li>Email' + error.data.errors.email + '</li>'
            }
            if (typeof error.data.errors.password != 'undefined') {
                message += '<li>Senha ' + error.data.errors.password + '</li>'
            }
            $ionicPopup.alert({
                title: 'Erro!!',
                template: message
            });
            $ionicLoading.hide();
        });

        alert('Entrou 5');

        $scope.$on('devise:new-registration', function(event, user) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Cadastro',
                template: 'Cadastro Realizado. Faça seu Login!!'
            });

            var config = {
                headers: {
                    'X-HTTP-Method-Override': 'DELETE'
                }
            };
            Auth.logout(config).then(function(oldUser) {
                // alert(oldUser.name + "you're signed out now.");
            }, function(error) {
                // An error occurred logging out.
            });
            $scope.$on('devise:logout', function(event, oldCurrentUser) {
                // ...
                $ionicLoading.hide();
                $state.go('login');
            });
            $state.go('login');
        });
    };

    $scope.enter = function() {
        $ionicLoading.show({
            template: 'Aguarde'
        });

        var credentials = {
            email: $scope.user.email,
            password: $scope.user.password
        };

        var config = {
            headers: {
                'X-HTTP-Method-Override': 'POST'
            }
        };

        Auth.login(credentials, config).then(function(user) {

        }, function(error) {
            $scope.error = 'Erro na autenticação';
            $ionicPopup.alert({
                title: 'Erro!!!',
                template: $scope.error
            });
            $ionicLoading.hide();
        });

        $scope.$on('devise:login', function(event, currentUser) {
            // after a login, a hard refresh, a new tab
        });


        $scope.$on('devise:new-session', function(event, currentUser) {
            $window.localStorage['user_token'] = JSON.stringify(currentUser);
            $ionicLoading.hide();
            $state.go('app.person');
        });
    };
})

// LOGOFF
.controller('logoffCtrl', function($scope, $state, $timeout, $ionicLoading, $ionicModal, Auth, $q, $window, $ionicPopup, Util) {
    $window.localStorage.removeItem('user_token');
    $state.go('login');
})

// MENU
.controller('menuCtrl', function($scope, $window) {
    $scope.user = JSON.parse($window.localStorage['user_token']);
})

// TIMELINE CONTROLLER
.controller('TimelineCtrl', function($scope, $stateParams, Util, $http, $window, $ionicLoading) {

    if (Util.logged()) {

        $scope.list_reminders = {};

        var user = JSON.parse($window.localStorage['user_token']);
        $scope.hasMoreData = true;
        $scope.page = 1;

        var parameters = {
            user_id: user.id,
            user_token: user.token,
            page: $scope.page
        };

        var config = {
            params: parameters
        };

        $http.get('http://realper.filiperaiz.com.br/api/v1/realper/list_reminders.json', config)
            .success(function(data, status, headers, config) {
                if (data.user_logged.flag) {
                    $scope.list_reminders = data.list_reminders;
                    $ionicLoading.hide();
                } else {
                    $window.localStorage.removeItem('user_token');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });


        $scope.loadMore = function() {
            //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            $scope.page += 1;

            var parameters = {
                token_user: user.token,
                user_id: user.id,
                user_token: user.token,
                page: $scope.page
            };

            var config = {
                params: parameters
            };

            $http.get('http://realper.filiperaiz.com.br/api/v1/realper/list_reminders.json', config)
                .success(function(data, status, headers, config) {
                    if (data.user_logged.flag) {
                        if (data.list_reminders.length == 0) {
                            $scope.hasMoreData = false;
                        }
                        for (i = 0; i < data.list_reminders.length; i++) {
                            $scope.list_reminders.push(data.list_reminders[i]);
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        $window.localStorage.removeItem('user_token');
                        $ionicLoading.hide();
                        $state.go('login');
                    }
                });
        };


    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})



// PERSON CONTROLLER
.controller('ListPersonCtrl', function($state, $scope, $stateParams, $window, Util, $ionicLoading, $http) {

    if (Util.logged()) {

        $scope.list_people = Array();

        var user = JSON.parse($window.localStorage['user_token']);
        $scope.hasMoreData = true;
        $scope.page = 1;

        var parameters = {
            user_id: user.id,
            user_token: user.token,
            page: $scope.page
        };

        var config = {
            params: parameters
        };

        $http.get('http://realper.filiperaiz.com.br/api/v1/realper/list_people.json', config)
            .success(function(data, status, headers, config) {
                if (data.user_logged.flag) {
                    $scope.list_people = data.list_people;
                    $ionicLoading.hide();
                } else {
                    $window.localStorage.removeItem('user_token');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });


        $scope.loadMore = function() {
            //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            $scope.page += 1;

            var parameters = {
                token_user: user.token,
                user_id: user.id,
                user_token: user.token,
                page: $scope.page
            };

            var config = {
                params: parameters
            };

            $http.get('http://realper.filiperaiz.com.br/api/v1/realper/list_people.json', config)
                .success(function(data, status, headers, config) {
                    if (data.user_logged.flag) {
                        if (data.list_people.length == 0) {
                            $scope.hasMoreData = false;
                        }
                        for (i = 0; i < data.list_people.length; i++) {
                            $scope.list_people.push(data.list_people[i]);
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        $window.localStorage.removeItem('user_token');
                        $ionicLoading.hide();
                        $state.go('login');
                    }
                });
        };


    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})

.controller('itemPersonIdCtrl', function($state, $scope, $stateParams, $window, Util, $ionicLoading, $http) {

    $scope.person_id = $stateParams.person_id;

    if (Util.logged()) {

        $scope.list_people = {};

        var user = JSON.parse($window.localStorage['user_token']);
        $scope.hasMoreData = true;
        $scope.page = 1;

        var parameters = {
            user_id: user.id,
            user_token: user.token,
            person_id: $scope.person_id
        };

        var config = {
            params: parameters
        };

        $http.get('http://realper.filiperaiz.com.br/api/v1/realper/person.json', config)
            .success(function(data, status, headers, config) {
                if (data.user_logged.flag) {
                    $scope.person = data.person;
                    $ionicLoading.hide();
                } else {
                    $window.localStorage.removeItem('user_token');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });

        $scope.delete = function(id) {

            var parameters = {
                user_id: user.id,
                user_token: user.token,
                person_id: id
            };

            var config = {
                params: parameters
            };

            $http.delete('http://realper.filiperaiz.com.br/api/v1/realper/person_delete.json', config)
                .success(function(data, status, headers) {
                    $state.go('app.person');
                })
                .error(function(data, status, header, config) {

                });
        }

        $scope.save = function(id) {

            if ($scope.person.avatar == 'img/upload/Icon-user.png') {
                avatar_img = '';
            } else {
                avatar_img = $scope.person.avatar;
            }

            var data = $.param({
                user_id: user.id,
                user_token: user.token,
                person_id: id,
                avatar: avatar_img,
                type_relative: $scope.person.type_relative,
                as_met: $scope.person.as_met,
                where_met: $scope.person.where_met,
                when_relationship: $scope.person.when_relationship,
                unforgettable_moments: $scope.person.unforgettable_moments,
                something_else: $scope.person.something_else,
                name: $scope.person.name,
                birth_date: $scope.person.birth_date,
                place_of_birth: $scope.person.place_of_birth,
                qualities: $scope.person.qualities,
                defects: $scope.person.defects,
                color: $scope.person.color,
                music: $scope.person.music,
                films: $scope.person.films,
                sports: $scope.person.sports,
                place: $scope.person.place,
                drinks: $scope.person.drinks,
                books: $scope.person.books,
                series: $scope.person.series,
                food: $scope.person.food,
                works_with_what: $scope.person.works_with_what,
                job_time: $scope.person.job_time,
                about_work: $scope.person.about_work,
                reliable_friends: $scope.person.reliable_friends,
                unreliable_friends: $scope.person.unreliable_friends,
                name_mother: $scope.person.name_mother,
                name_father: $scope.person.name_father,
                brothers: $scope.person.brothers,
                other_relatives: $scope.person.other_relatives,
                shirt_size: $scope.person.shirt_size,
                pant_size: $scope.person.pant_size,
                short_size: $scope.person.short_size,
                other_clothes: $scope.person.other_clothes,
                nick: $scope.person.nick,
                tatu: $scope.person.tatu,
                piercing: $scope.person.piercing,
                subject: $scope.person.subject,
                attitudes: $scope.person.attitudes,
                team: $scope.person.team,
                animals: $scope.person.animals,
                size_food: $scope.person.size_food,
                dream: $scope.person.dream,
                not_like: $scope.person.not_like,
                date_tmp: $scope.person.date_tmp,
                kids: $scope.person.kids
            });

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://realper.filiperaiz.com.br/api/v1/realper/person_save.json', data, config)
                .success(function(data, status, headers) {
                    if (typeof data.errors_reminder == "undefined") {
                        $ionicLoading.hide();
                        $state.go('app.person');
                    } else {
                        var er = '';
                        for (i = 0; i < data.errors_reminder.length; i++) {
                            er += data.errors_reminder[i].message + '<br>';
                        }
                        $ionicPopup.alert({
                            title: 'Erro!!!',
                            template: er
                        });
                        $ionicLoading.hide();
                    }
                })
                .error(function(data, status, header, config) {

                });
        }

        $scope.takePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.person.avatar = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

        $scope.choosePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.person.avatar = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})

.controller('itemPersonNewCtrl', function($state, $scope, $stateParams, $cordovaCamera, $ionicScrollDelegate, $http, Util, $window, $ionicLoading, $ionicPopup) {

    if (Util.logged()) {

        $scope.person = {};

        $scope.add_person = function() {

            $ionicLoading.show({
                template: 'Aguarde'
            });

            var user = JSON.parse($window.localStorage['user_token']);

            var data = $.param({
                user_id: user.id,
                user_token: user.token,
                avatar: $scope.person.avatar,
                type_relative: $scope.person.type_relative,
                as_met: $scope.person.as_met,
                where_met: $scope.person.where_met,
                when_relationship: $scope.person.when_relationship,
                unforgettable_moments: $scope.person.unforgettable_moments,
                something_else: $scope.person.something_else,
                name: $scope.person.name,
                birth_date: $scope.person.birth_date,
                place_of_birth: $scope.person.place_of_birth,
                qualities: $scope.person.qualities,
                defects: $scope.person.defects,
                color: $scope.person.color,
                music: $scope.person.music,
                films: $scope.person.films,
                sports: $scope.person.sports,
                place: $scope.person.place,
                drinks: $scope.person.drinks,
                books: $scope.person.books,
                series: $scope.person.series,
                food: $scope.person.food,
                works_with_what: $scope.person.works_with_what,
                job_time: $scope.person.job_time,
                about_work: $scope.person.about_work,
                reliable_friends: $scope.person.reliable_friends,
                unreliable_friends: $scope.person.unreliable_friends,
                name_mother: $scope.person.name_mother,
                name_father: $scope.person.name_father,
                brothers: $scope.person.brothers,
                other_relatives: $scope.person.other_relatives,
                shirt_size: $scope.person.shirt_size,
                pant_size: $scope.person.pant_size,
                short_size: $scope.person.short_size,
                other_clothes: $scope.person.other_clothes,
                nick: $scope.person.nick,
                tatu: $scope.person.tatu,
                piercing: $scope.person.piercing,
                subject: $scope.person.subject,
                attitudes: $scope.person.attitudes,
                team: $scope.person.team,
                animals: $scope.person.animals,
                size_food: $scope.person.size_food,
                dream: $scope.person.dream,
                not_like: $scope.person.not_like,
                date_tmp: $scope.person.date_tmp,
                kids: $scope.person.kids
            });

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }


            $http.post('http://realper.filiperaiz.com.br/api/v1/realper/person_save.json', data, config)
                .success(function(data, status, headers, config) {

                    if (data.user_logged.flag) {
                        if (typeof data.errors_person == "undefined") {
                            $ionicLoading.hide();
                            $state.go('app.person');
                        } else {
                            var er = '';
                            for (i = 0; i < data.errors_person.length; i++) {
                                er += data.errors_person[i].message + '<br>';
                            }
                            $ionicPopup.alert({
                                title: 'Erro!!!',
                                template: er
                            });
                            $ionicLoading.hide();
                        }
                    } else {
                        $window.localStorage.removeItem('user_token');
                        $ionicLoading.hide();
                        $state.go('login');
                    }
                });
        }


        var g = document.getElementsByClassName("acc-input");
        for (var i = 0; i < g.length; i++) {
            g[i].onclick = function() { $ionicScrollDelegate.resize(); };
        }

        $scope.takePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.person.avatar = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

        $scope.choosePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.person.avatar = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})



// REMINDER
.controller('itemPersonDateCtrl', function($state, $scope, $stateParams, $cordovaCamera, $ionicScrollDelegate, $http, Util, $window, $ionicLoading, $ionicPopup) {

    $scope.person_id = $stateParams.person_id;

    if (Util.logged()) {

        $scope.list_reminders = Array();

        var user = JSON.parse($window.localStorage['user_token']);
        $scope.hasMoreData = true;
        $scope.page = 1;

        var parameters = {
            user_id: user.id,
            user_token: user.token,
            person_id: $scope.person_id,
            page: $scope.page
        };

        var config = {
            params: parameters
        };

        $http.get('http://realper.filiperaiz.com.br/api/v1/realper/list_reminders.json', config)
            .success(function(data, status, headers, config) {
                if (data.user_logged.flag) {
                    $scope.list_reminders = data.list_reminders;
                    $ionicLoading.hide();
                } else {
                    $window.localStorage.removeItem('user_token');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });


        $scope.loadMore = function() {
            //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            $scope.page += 1;

            var parameters = {
                token_user: user.token,
                user_id: user.id,
                user_token: user.token,
                person_id: $scope.person_id,
                page: $scope.page
            };

            var config = {
                params: parameters
            };

            $http.get('http://realper.filiperaiz.com.br/api/v1/realper/list_reminders.json', config)
                .success(function(data, status, headers, config) {
                    if (data.user_logged.flag) {
                        if (data.list_reminders.length == 0) {
                            $scope.hasMoreData = false;
                        }
                        for (i = 0; i < data.list_reminders.length; i++) {
                            $scope.list_reminders.push(data.list_reminders[i]);
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        $window.localStorage.removeItem('user_token');
                        $ionicLoading.hide();
                        $state.go('login');
                    }
                });
        };


    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})

.controller('itemPersonDateIdCtrl', function($state, $scope, $stateParams, $cordovaCamera, $ionicScrollDelegate, $http, Util, $window, $ionicLoading, $ionicPopup) {

    $scope.reminder_id = $stateParams.reminder_id;

    if (Util.logged()) {

        $scope.person = {};

        var user = JSON.parse($window.localStorage['user_token']);
        $scope.hasMoreData = true;

        var parameters = {
            user_id: user.id,
            user_token: user.token,
            reminder_id: $scope.reminder_id
        };

        var config = {
            params: parameters
        };

        $http.get('http://realper.filiperaiz.com.br/api/v1/realper/reminder.json', config)
            .success(function(data, status, headers, config) {
                if (data.user_logged.flag) {
                    $scope.reminder = data.reminder;
                    $scope.reminder.date = new Date($scope.reminder.date);
                    $ionicLoading.hide();
                } else {
                    $window.localStorage.removeItem('user_token');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });


        $scope.delete = function(id) {

            var parameters = {
                user_id: user.id,
                user_token: user.token,
                reminder_id: id
            };

            var config = {
                params: parameters
            };

            $http.delete('http://realper.filiperaiz.com.br/api/v1/realper/reminder_delete.json', config)
                .success(function(data, status, headers) {
                    $state.go('app.person_date', { person_id: data.person.id });
                })
                .error(function(data, status, header, config) {

                });
        }

        $scope.save = function(id) {

            var data = $.param({
                user_id: user.id,
                user_token: user.token,
                reminder_id: id,
                date: $scope.reminder.date,
                name: $scope.reminder.name,
                description: $scope.reminder.description
            });

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://realper.filiperaiz.com.br/api/v1/realper/reminder_save.json', data, config)
                .success(function(data, status, headers) {
                    if (typeof data.errors_reminder == "undefined") {
                        $ionicLoading.hide();
                        $state.go('app.person_date', { person_id: data.person.id });
                    } else {
                        var er = '';
                        for (i = 0; i < data.errors_reminder.length; i++) {
                            er += data.errors_reminder[i].message + '<br>';
                        }
                        $ionicPopup.alert({
                            title: 'Erro!!!',
                            template: er
                        });
                        $ionicLoading.hide();
                    }
                })
                .error(function(data, status, header, config) {

                });
        }

    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})

.controller('itemPersonDateNewCtrl', function($state, $scope, $stateParams, $cordovaCamera, $ionicScrollDelegate, $http, Util, $window, $ionicLoading, $ionicPopup) {

    if (Util.logged()) {

        $scope.reminder = {};

        var user = JSON.parse($window.localStorage['user_token']);
        var person_id = $stateParams.person_id;


        $scope.save = function() {

            var data = $.param({
                user_id: user.id,
                user_token: user.token,
                date: $scope.reminder.date,
                person_id: person_id,
                description: $scope.reminder.description
            });

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://realper.filiperaiz.com.br/api/v1/realper/reminder_save.json', data, config)
                .success(function(data, status, headers) {
                    if (typeof data.errors_date == "undefined") {

                        if (typeof data.errors_reminder == "undefined") {
                            $ionicLoading.hide();
                            $state.go('app.person_date', { person_id: data.person.id });
                        } else {
                            var er = '';
                            for (i = 0; i < data.errors_reminder.length; i++) {
                                er += data.errors_reminder[i].message + '<br>';
                            }
                            $ionicPopup.alert({
                                title: 'Erro!!!',
                                template: er
                            });
                            $ionicLoading.hide();
                        }
                    } else {
                        var er = '';
                        for (i = 0; i < data.errors_person.length; i++) {
                            er += data.errors_person[i].message + '<br>';
                        }
                        $ionicPopup.alert({
                            title: 'Erro!!!',
                            template: er
                        });
                        $ionicLoading.hide();
                    }





                })
                .error(function(data, status, header, config) {

                });
        }

    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})



// PLACE
.controller('itemPersonPlaceCtrl', function($state, $scope, $stateParams, $cordovaCamera, $ionicScrollDelegate, $http, Util, $window, $ionicLoading, $ionicPopup) {

    $scope.person_id = $stateParams.person_id;

    if (Util.logged()) {

        $scope.list_places = Array();

        var user = JSON.parse($window.localStorage['user_token']);
        $scope.hasMoreData = true;
        $scope.page = 1;

        var parameters = {
            user_id: user.id,
            user_token: user.token,
            person_id: $scope.person_id,
            page: $scope.page
        };

        var config = {
            params: parameters
        };

        $http.get('http://realper.filiperaiz.com.br/api/v1/realper/list_places.json', config)
            .success(function(data, status, headers, config) {
                if (data.user_logged.flag) {
                    $scope.list_places = data.list_places;
                    $ionicLoading.hide();
                } else {
                    $window.localStorage.removeItem('user_token');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });


        $scope.loadMore = function() {
            //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            $scope.page += 1;

            var parameters = {
                token_user: user.token,
                user_id: user.id,
                user_token: user.token,
                person_id: $scope.person_id,
                page: $scope.page
            };

            var config = {
                params: parameters
            };

            $http.get('http://realper.filiperaiz.com.br/api/v1/realper/list_places.json', config)
                .success(function(data, status, headers, config) {
                    if (data.user_logged.flag) {
                        if (data.list_places.length == 0) {
                            $scope.hasMoreData = false;
                        }
                        for (i = 0; i < data.list_places.length; i++) {
                            $scope.list_places.push(data.list_places[i]);
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        $window.localStorage.removeItem('user_token');
                        $ionicLoading.hide();
                        $state.go('login');
                    }
                });
        };


    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})

.controller('itemPersonPlaceIdCtrl', function($state, $scope, $stateParams, $cordovaCamera, $ionicScrollDelegate, $http, Util, $window, $ionicLoading, $ionicPopup) {

    $scope.place_id = $stateParams.place_id;

    if (Util.logged()) {

        $scope.person = {};

        var user = JSON.parse($window.localStorage['user_token']);
        $scope.hasMoreData = true;

        var parameters = {
            user_id: user.id,
            user_token: user.token,
            place_id: $scope.place_id
        };

        var config = {
            params: parameters
        };

        $http.get('http://realper.filiperaiz.com.br/api/v1/realper/place.json', config)
            .success(function(data, status, headers, config) {
                if (data.user_logged.flag) {
                    $scope.place = data.place;
                    $ionicLoading.hide();
                } else {
                    $window.localStorage.removeItem('user_token');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });


        $scope.delete = function(id) {
            $ionicLoading.show({ template: 'Aguarde' });
            var parameters = {
                user_id: user.id,
                user_token: user.token,
                place_id: id
            };

            var config = {
                params: parameters
            };

            $http.delete('http://realper.filiperaiz.com.br/api/v1/realper/place_delete.json', config)
                .success(function(data, status, headers) {
                    $ionicLoading.hide();
                    $state.go('app.person_place', { person_id: data.person.id });
                })
                .error(function(data, status, header, config) {

                });
        }

        $scope.save = function(id) {
            $ionicLoading.show({ template: 'Aguarde' });
            var data = $.param({
                user_id: user.id,
                user_token: user.token,
                place_id: id,
                title: $scope.place.title,
                description: $scope.place.description,
                image: $scope.place.image
            });

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://realper.filiperaiz.com.br/api/v1/realper/place_save.json', data, config)
                .success(function(data, status, headers) {
                    if (typeof data.errors_place == "undefined") {
                        $ionicLoading.hide();
                        $state.go('app.person_place', { person_id: data.person.id });
                    } else {
                        var er = '';
                        for (i = 0; i < data.errors_place.length; i++) {
                            er += data.errors_place[i].message + '<br>';
                        }
                        $ionicPopup.alert({
                            title: 'Erro!!!',
                            template: er
                        });
                        $ionicLoading.hide();
                    }
                })
                .error(function(data, status, header, config) {

                });
        }

        $scope.takePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.place.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

        $scope.choosePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.place.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})

.controller('itemPersonPlaceNewCtrl', function($state, $scope, $stateParams, $cordovaCamera, $ionicScrollDelegate, $http, Util, $window, $ionicLoading, $ionicPopup) {

    if (Util.logged()) {

        $scope.place = {};

        var user = JSON.parse($window.localStorage['user_token']);
        var person_id = $stateParams.person_id;


        $scope.save = function() {
            $ionicLoading.show({ template: 'Aguarde' });
            var data = $.param({
                user_id: user.id,
                user_token: user.token,
                title: $scope.place.title,
                description: $scope.place.description,
                image: $scope.place.image,
                person_id: person_id
            });

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://realper.filiperaiz.com.br/api/v1/realper/place_save.json', data, config)
                .success(function(data, status, headers) {

                    if (typeof data.errors_place == "undefined") {
                        $ionicLoading.hide();
                        $state.go('app.person_place', { person_id: data.person.id });
                    } else {
                        var er = '';
                        for (i = 0; i < data.errors_place.length; i++) {
                            er += data.errors_place[i].message + '<br>';
                        }
                        $ionicPopup.alert({
                            title: 'Erro!!!',
                            template: er
                        });
                        $ionicLoading.hide();
                    }
                })
                .error(function(data, status, header, config) {

                });
        }

        $scope.takePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.place.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

        $scope.choosePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.place.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})



// FOOD
.controller('itemPersonFoodCtrl', function($state, $scope, $stateParams, $cordovaCamera, $ionicScrollDelegate, $http, Util, $window, $ionicLoading, $ionicPopup) {

    $scope.person_id = $stateParams.person_id;

    if (Util.logged()) {

        $scope.list_foods = Array();

        var user = JSON.parse($window.localStorage['user_token']);
        $scope.hasMoreData = true;
        $scope.page = 1;

        var parameters = {
            user_id: user.id,
            user_token: user.token,
            person_id: $scope.person_id,
            page: $scope.page
        };

        var config = {
            params: parameters
        };

        $http.get('http://realper.filiperaiz.com.br/api/v1/realper/list_foods.json', config)
            .success(function(data, status, headers, config) {
                if (data.user_logged.flag) {
                    $scope.list_foods = data.list_foods;
                    $ionicLoading.hide();
                } else {
                    $window.localStorage.removeItem('user_token');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });


        $scope.loadMore = function() {
            //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            $scope.page += 1;

            var parameters = {
                token_user: user.token,
                user_id: user.id,
                user_token: user.token,
                person_id: $scope.person_id,
                page: $scope.page
            };

            var config = {
                params: parameters
            };

            $http.get('http://realper.filiperaiz.com.br/api/v1/realper/list_foods.json', config)
                .success(function(data, status, headers, config) {
                    if (data.user_logged.flag) {
                        if (data.list_foods.length == 0) {
                            $scope.hasMoreData = false;
                        }
                        for (i = 0; i < data.list_foods.length; i++) {
                            $scope.list_foods.push(data.list_foods[i]);
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        $window.localStorage.removeItem('user_token');
                        $ionicLoading.hide();
                        $state.go('login');
                    }
                });
        };


    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})

.controller('itemPersonFoodIdCtrl', function($state, $scope, $stateParams, $cordovaCamera, $ionicScrollDelegate, $http, Util, $window, $ionicLoading, $ionicPopup) {

    $scope.food_id = $stateParams.food_id;

    if (Util.logged()) {


        var user = JSON.parse($window.localStorage['user_token']);
        $scope.hasMoreData = true;

        var parameters = {
            user_id: user.id,
            user_token: user.token,
            food_id: $scope.food_id
        };

        var config = {
            params: parameters
        };

        $http.get('http://realper.filiperaiz.com.br/api/v1/realper/food.json', config)
            .success(function(data, status, headers, config) {
                if (data.user_logged.flag) {
                    $scope.food = data.food;
                    $ionicLoading.hide();
                } else {
                    $window.localStorage.removeItem('user_token');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });


        $scope.delete = function(id) {
            $ionicLoading.show({ template: 'Aguarde' });
            var parameters = {
                user_id: user.id,
                user_token: user.token,
                food_id: id
            };

            var config = {
                params: parameters
            };

            $http.delete('http://realper.filiperaiz.com.br/api/v1/realper/food_delete.json', config)
                .success(function(data, status, headers) {
                    $ionicLoading.hide();
                    $state.go('app.person_food', { person_id: data.person.id });
                })
                .error(function(data, status, header, config) {

                });
        }

        $scope.save = function(id) {
            $ionicLoading.show({ template: 'Aguarde' });
            var data = $.param({
                user_id: user.id,
                user_token: user.token,
                food_id: id,
                title: $scope.food.title,
                description: $scope.food.description,
                image: $scope.food.image
            });

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://realper.filiperaiz.com.br/api/v1/realper/food_save.json', data, config)
                .success(function(data, status, headers) {

                    if (typeof data.errors_food == "undefined") {
                        $ionicLoading.hide();
                        $state.go('app.person_food', { person_id: data.person.id });
                    } else {
                        var er = '';
                        for (i = 0; i < data.errors_food.length; i++) {
                            er += data.errors_food[i].message + '<br>';
                        }
                        $ionicPopup.alert({
                            title: 'Erro!!!',
                            template: er
                        });
                        $ionicLoading.hide();
                    }
                })
                .error(function(data, status, header, config) {

                });
        }

        $scope.takePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.food.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

        $scope.choosePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.food.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})

.controller('itemPersonFoodNewCtrl', function($state, $scope, $stateParams, $cordovaCamera, $ionicScrollDelegate, $http, Util, $window, $ionicLoading, $ionicPopup) {

    if (Util.logged()) {

        $scope.food = {};

        var user = JSON.parse($window.localStorage['user_token']);
        var person_id = $stateParams.person_id;


        $scope.save = function() {
            $ionicLoading.show({ template: 'Aguarde' });
            var data = $.param({
                user_id: user.id,
                user_token: user.token,
                title: $scope.food.title,
                description: $scope.food.description,
                image: $scope.food.image,
                person_id: person_id
            });

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://realper.filiperaiz.com.br/api/v1/realper/food_save.json', data, config)
                .success(function(data, status, headers) {
                    if (typeof data.errors_food == "undefined") {
                        $ionicLoading.hide();
                        $state.go('app.person_food', { person_id: data.person.id });
                    } else {
                        var er = '';
                        for (i = 0; i < data.errors_food.length; i++) {
                            er += data.errors_food[i].message + '<br>';
                        }
                        $ionicPopup.alert({
                            title: 'Erro!!!',
                            template: er
                        });
                        $ionicLoading.hide();
                    }
                })
                .error(function(data, status, header, config) {

                });
        }

        $scope.takePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.food.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

        $scope.choosePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.food.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})



// INTEREST
.controller('itemPersonInterestsCtrl', function($state, $scope, $stateParams, $cordovaCamera, $ionicScrollDelegate, $http, Util, $window, $ionicLoading, $ionicPopup) {

    $scope.person_id = $stateParams.person_id;

    if (Util.logged()) {

        $scope.list_interests = Array();

        var user = JSON.parse($window.localStorage['user_token']);
        $scope.hasMoreData = true;
        $scope.page = 1;

        var parameters = {
            user_id: user.id,
            user_token: user.token,
            person_id: $scope.person_id,
            page: $scope.page
        };

        var config = {
            params: parameters
        };

        $http.get('http://realper.filiperaiz.com.br/api/v1/realper/list_interests.json', config)
            .success(function(data, status, headers, config) {
                if (data.user_logged.flag) {
                    $scope.list_interests = data.list_interests;
                    $ionicLoading.hide();
                } else {
                    $window.localStorage.removeItem('user_token');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });


        $scope.loadMore = function() {
            //$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner><br>Aguarde...'});
            $scope.page += 1;

            var parameters = {
                token_user: user.token,
                user_id: user.id,
                user_token: user.token,
                person_id: $scope.person_id,
                page: $scope.page
            };

            var config = {
                params: parameters
            };

            $http.get('http://realper.filiperaiz.com.br/api/v1/realper/list_interests.json', config)
                .success(function(data, status, headers, config) {
                    if (data.user_logged.flag) {
                        if (data.list_interests.length == 0) {
                            $scope.hasMoreData = false;
                        }
                        for (i = 0; i < data.list_interests.length; i++) {
                            $scope.list_interests.push(data.list_interests[i]);
                        }
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    } else {
                        $window.localStorage.removeItem('user_token');
                        $ionicLoading.hide();
                        $state.go('login');
                    }
                });
        };


    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})

.controller('itemPersonInterestsIdCtrl', function($state, $scope, $stateParams, $cordovaCamera, $ionicScrollDelegate, $http, Util, $window, $ionicLoading, $ionicPopup) {

    $scope.interest_id = $stateParams.interest_id;

    if (Util.logged()) {

        $scope.person = {};

        var user = JSON.parse($window.localStorage['user_token']);
        $scope.hasMoreData = true;

        var parameters = {
            user_id: user.id,
            user_token: user.token,
            interest_id: $scope.interest_id
        };

        var config = {
            params: parameters
        };

        $http.get('http://realper.filiperaiz.com.br/api/v1/realper/interest.json', config)
            .success(function(data, status, headers, config) {
                if (data.user_logged.flag) {
                    $scope.interest = data.interest;
                    $ionicLoading.hide();
                } else {
                    $window.localStorage.removeItem('user_token');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });


        $scope.delete = function(id) {
            $ionicLoading.show({ template: 'Aguarde' });
            var parameters = {
                user_id: user.id,
                user_token: user.token,
                interest_id: id
            };

            var config = {
                params: parameters
            };

            $http.delete('http://realper.filiperaiz.com.br/api/v1/realper/interest_delete.json', config)
                .success(function(data, status, headers) {
                    $ionicLoading.hide();
                    $state.go('app.person_present', { person_id: data.person.id });
                })
                .error(function(data, status, header, config) {

                });
        }

        $scope.save = function(id) {
            $ionicLoading.show({ template: 'Aguarde' });
            var data = $.param({
                user_id: user.id,
                user_token: user.token,
                interest_id: id,
                title: $scope.interest.title,
                description: $scope.interest.description,
                image: $scope.interest.image
            });

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://realper.filiperaiz.com.br/api/v1/realper/interest_save.json', data, config)
                .success(function(data, status, headers) {
                    if (typeof data.errors_interest == "undefined") {
                        $ionicLoading.hide();
                        $state.go('app.person_present', { person_id: data.person.id });
                    } else {
                        var er = '';
                        for (i = 0; i < data.errors_interest.length; i++) {
                            er += data.errors_interest[i].message + '<br>';
                        }
                        $ionicPopup.alert({
                            title: 'Erro!!!',
                            template: er
                        });
                        $ionicLoading.hide();
                    }
                })
                .error(function(data, status, header, config) {

                });
        }

        $scope.takePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.interest.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

        $scope.choosePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.interest.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})

.controller('itemPersonInterestsNewCtrl', function($state, $scope, $stateParams, $cordovaCamera, $ionicScrollDelegate, $http, Util, $window, $ionicLoading, $ionicPopup) {

    if (Util.logged()) {

        $scope.interest = {};

        var user = JSON.parse($window.localStorage['user_token']);
        var person_id = $stateParams.person_id;


        $scope.save = function() {
            $ionicLoading.show({ template: 'Aguarde' });
            var data = $.param({
                user_id: user.id,
                user_token: user.token,
                title: $scope.interest.title,
                description: $scope.interest.description,
                image: $scope.interest.image,
                person_id: person_id
            });

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://realper.filiperaiz.com.br/api/v1/realper/interest_save.json', data, config)
                .success(function(data, status, headers) {

                    if (typeof data.errors_interest == "undefined") {
                        $ionicLoading.hide();
                        $state.go('app.person_present', { person_id: data.person.id });
                    } else {
                        var er = '';
                        for (i = 0; i < data.errors_interest.length; i++) {
                            er += data.errors_interest[i].message + '<br>';
                        }
                        $ionicPopup.alert({
                            title: 'Erro!!!',
                            template: er
                        });
                        $ionicLoading.hide();
                    }
                })
                .error(function(data, status, header, config) {

                });
        }

        $scope.takePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.interest.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

        $scope.choosePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.interest.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})


.controller('sendPicCtrl', function($scope, $window, $state, $stateParams, $cordovaCamera, $http, Util, $ionicLoading, $ionicPopup) {

    if (Util.logged()) {

        var user = JSON.parse($window.localStorage['user_token']);

        $scope.element = {};

        var parameters = {
            user_id: user.id,
            user_token: user.token,
            flag_all: true
        };

        var config = {
            params: parameters
        };

        $http.get('http://realper.filiperaiz.com.br/api/v1/realper/list_people.json', config)
            .success(function(data, status, headers, config) {
                if (data.user_logged.flag) {
                    $scope.list_people = data.list_people;
                    $ionicLoading.hide();
                } else {
                    $window.localStorage.removeItem('user_token');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });


        $scope.save = function() {
            if (validate()) {
                $ionicLoading.show({ template: 'Aguarde' });
                var data = $.param({
                    user_id: user.id,
                    user_token: user.token,
                    title: $scope.element.title,
                    description: $scope.element.description,
                    image: $scope.element.image,
                    person_id: $scope.element.person_id
                });


                var config = {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                }

                if ($scope.element.type == 'comidas') {
                    var url = 'http://realper.filiperaiz.com.br/api/v1/realper/food_save.json';
                } else if ($scope.element.type == 'presentes') {
                    var url = 'http://realper.filiperaiz.com.br/api/v1/realper/interest_save.json';
                } else if ($scope.element.type == 'lugares') {
                    var url = 'http://realper.filiperaiz.com.br/api/v1/realper/place_save.json';
                }

                $http.post(url, data, config)
                    .success(function(data, status, headers) {

                        if ($scope.element.type == 'comidas') {
                            errors = data.errors_food;
                        } else if ($scope.element.type == 'presentes') {
                            errors = data.errors_interest;
                        } else if ($scope.element.type == 'lugares') {
                            errors = data.errors_place;
                        }


                        if (typeof errors == "undefined") {
                            $ionicLoading.hide();

                            if ($scope.element.type == 'comidas') {
                                $state.go('app.person_food', { person_id: data.person.id });
                            } else if ($scope.element.type == 'presentes') {
                                $state.go('app.person_present', { person_id: data.person.id });
                            } else if ($scope.element.type == 'lugares') {
                                $state.go('app.person_place', { person_id: data.person.id });
                            }
                        } else {
                            var er = '';
                            for (i = 0; i < errors.length; i++) {
                                er += errors[i].message + '<br>';
                            }
                            $ionicPopup.alert({
                                title: 'Erro!!!',
                                template: er
                            });
                            $ionicLoading.hide();
                        }
                    })
                    .error(function(data, status, header, config) {

                    });
            }
        }

        validate = function() {
            flag_val = false;
            if (Util.emptyVal($scope.element.type)) {
                $ionicPopup.alert({
                    title: 'Erro!!!',
                    template: 'Escolha uma categoria'
                });
            } else if (Util.emptyVal($scope.element.person_id)) {
                $ionicPopup.alert({
                    title: 'Erro!!!',
                    template: 'Escolha uma pessoa'
                });
            } else {
                flag_val = true;
            }
            return flag_val;
        }

        $scope.takePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.element.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

        $scope.choosePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.element.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
})

.controller('profileCtrl', function($scope, $stateParams, $cordovaCamera, Util, $window, $http, $ionicLoading, $state, $cordovaCamera) {

    if (Util.logged()) {

        $("#phone_n").mask('(00) 00000-0000');

        var user = JSON.parse($window.localStorage['user_token']);

        $scope.user_edit = {};

        var parameters = {
            user_id: user.id,
            user_token: user.token
        };

        var config = {
            params: parameters
        };

        $http.get('http://realper.filiperaiz.com.br/api/v1/realper/profile.json', config)
            .success(function(data, status, headers, config) {
                if (data.user_logged.flag) {
                    $scope.user_edit = data.profile;
                    $ionicLoading.hide();
                } else {
                    $window.localStorage.removeItem('user_token');
                    $ionicLoading.hide();
                    $state.go('login');
                }
            });




        $scope.save = function(id) {
            $ionicLoading.show({ template: 'Aguarde' });

            var data = $.param({
                user_id: user.id,
                user_token: user.token,
                name: $scope.user_edit.name,
                phone_number: $scope.user_edit.phone_number,
                image: $scope.user_edit.image
            });

            console.log(data)

            var config = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }

            $http.post('http://realper.filiperaiz.com.br/api/v1/realper/profile_edit.json', data, config)
                .success(function(data, status, headers) {

                    if (typeof data.errors_user == "undefined") {
                        $ionicLoading.hide();
                        $state.go('app.person');
                    } else {
                        var er = '';
                        for (i = 0; i < data.errors_user.length; i++) {
                            er += data.errors_user[i].message + '<br>';
                        }
                        $ionicPopup.alert({
                            title: 'Erro!!!',
                            template: er
                        });
                        $ionicLoading.hide();
                    }
                })
                .error(function(data, status, header, config) {

                });
        }

        $scope.takePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.user_edit.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

        $scope.choosePhoto = function() {
            var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.user_edit.image = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        }

    } else {
        $ionicLoading.hide();
        $state.go('login');
    }
});
