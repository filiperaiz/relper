angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $stateParams) {})


// LOGIN CONTROLLER
.controller('loginCtrl', function($scope, $state, $timeout, $ionicLoading, $ionicModal) {
    $scope.activeTemplate = 'login';

    $scope.facebook = function() {
        $ionicLoading.show({
            template: 'Aguarde'
        });
        $timeout(function() {
            $ionicLoading.hide();
            $state.go('sign-in');
        }, 2000);
    };

    $scope.signin = function() {
        $state.go('sign-in');
    };


    $scope.enter = function() {
        $ionicLoading.show({
            template: 'Aguarde'
        });
        $timeout(function() {
            $ionicLoading.hide();
            $state.go('app.person');
        }, 2000);
    };
})


// TIMELINE CONTROLLER
.controller('TimelineCtrl', function($scope, $stateParams) {})

// PERSON CONTROLLER
.controller('PersonCtrl', function($scope, $stateParams) {})

.controller('itemPersonCtrl', function($scope, $stateParams, $cordovaCamera, $ionicScrollDelegate) {

  var g = document.getElementsByClassName("acc-input");
  for (var i=0; i < g.length; i++) {
    g[i].onclick = function(){$ionicScrollDelegate.resize();};
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
          $scope.imgURI = "data:image/jpeg;base64," + imageData;
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
          $scope.imgURI = "data:image/jpeg;base64," + imageData;
      }, function(err) {
          // An error occured. Show a message to the user
      });
  }
})


.controller('sendPicCtrl', function($scope, $stateParams, $cordovaCamera) {
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
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
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
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }
})

.controller('profileCtrl', function($scope, $stateParams,  $cordovaCamera) {
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
          $scope.imgURI = "data:image/jpeg;base64," + imageData;
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
          $scope.imgURI = "data:image/jpeg;base64," + imageData;
      }, function(err) {
          // An error occured. Show a message to the user
      });
  }
});








// .controller('PlaylistsCtrl', function($scope) {
//     $scope.playlists = [
//         { title: 'Reggae', id: 1 },
//         { title: 'Chill', id: 2 },
//         { title: 'Dubstep', id: 3 },
//         { title: 'Indie', id: 4 },
//         { title: 'Rap', id: 5 },
//         { title: 'Cowbell', id: 6 }
//     ];
// })

// .controller('PlaylistCtrl', function($scope, $stateParams) {});
