angular.module('starter.services', [])

.factory('Util', function($window){
    return {
        emptyVal: function(data){
            if (data != null && data != undefined && data != 'undefined' && data != ''){
                flag = false;
            }else{
                flag = true;
            }
            return flag;
        },
        logged: function(){
            var user = $window.localStorage.getItem('user_token');
            if (user != null && user != undefined && user != 'undefined' && user != ''){
                return true;
            }else{
                return false;
            }
        }
    };
})



