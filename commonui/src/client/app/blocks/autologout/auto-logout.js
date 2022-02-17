

(function() {
    'use strict';

    angular
        .module('wdts.autologout',[])
        .run(['$rootScope','$timeout','$document','config','store','jwtHelper','$window','$http','jwtTokenKey',function($rootScope,$timeout,$document,config,store,jwtHelper,$window,$http,jwtTokenKey){

            var TimeOutTimerValue;
            var decodedJwt;

            $http({
                method: 'GET',
                url:  config.configration.route + '?templateTypeCode=SYSTEM&type=TEMPLATE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function(response){
                getInactivity(response.data[0].propertyValues);
            },function () {
                console.log("Error in getting inactivity time from config App");
            });


            function getInactivity(props){

                for(var i =0; i<props.length; i++){
                    if(props[i].propertyId==1001){
                        TimeOutTimerValue = props[i].propertyValue*1000;
                    }
                }

                var TimeOut_Thread = $timeout(function(){ LogoutByTimer() } , TimeOutTimerValue);
                var bodyElement = angular.element($document);

                angular.forEach(['keydown', 'keyup', 'click', 'mousemove', 'DOMMouseScroll', 'mousewheel', 'mousedown', 'touchstart', 'touchmove', 'scroll', 'focus'],
                    function(EventName) {
                        var currentTime = new  Date().getTime();
                        if(currentTime - sessionStorage.lastActiveTime >TimeOutTimerValue){
                            LogoutByTimer();
                        }else{
                            bodyElement.bind(EventName, function (e) { TimeOut_Resetter(e) });
                        }

                    });

                function LogoutByTimer(){

                    sessionStorage.clear();

                    if(store.get(jwtTokenKey) != null) {
                        decodedJwt = store.get(jwtTokenKey);
                        decodedJwt = jwtHelper.decodeToken(decodedJwt);
                    }


                    if(decodedJwt.firstName == 'PP'){
                        $http({
                            method: 'POST',
                            url:  config.auth.oauthLogout,
                            headers: {
                                'Content-Type': 'application/json','Authorization': "Bearer " + store.get(jwtTokenKey)
                            }
                        }).then(function(data){
                            localStorage.clear();
                            $window.location.href = config.ppmasterLoginUrl;
                        },function error(){
                            logger.fatal('ppmaster logout issue in service');
                            localStorage.clear();
                        });
                    }
                    else {
                        if(store.get(jwtTokenKey)) {
                            $rootScope.$emit('logout');
                        }
                    }

                }

                function TimeOut_Resetter(e){
                    sessionStorage.lastActiveTime = new  Date().getTime();
                    $timeout.cancel(TimeOut_Thread);
                    TimeOut_Thread = $timeout(function(){ LogoutByTimer() } , TimeOutTimerValue);
                }
            }

        }])
})();
