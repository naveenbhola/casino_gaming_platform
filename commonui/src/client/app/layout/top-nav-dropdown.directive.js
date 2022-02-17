(function () {
    'use strict';


    angular
        .module('wdts.commonui.layout')
        .directive('wdtsTopNavDropdown', wdtsTopNavDropdown);

    function wdtsTopNavDropdown() {
        var directive = {
            bindToController: true,
            controller: TopNavDropdownController,
            controllerAs: 'topNavDropdown',
            restrict: 'EA',
            scope: {},
            templateUrl: '../bower_components/wdts-common-ui/src/client/app/layout/top-nav-dropdown.html'
        };


        function TopNavDropdownController($rootScope, $window, $translate, overviewService, messagingService, logger, config, $location,jwtTokenKey,store,$state) {
            var topNavDropdown = this;

            topNavDropdown.getUsername = getUsername;
            topNavDropdown.logout = logout;
            topNavDropdown.changeLanguage = changeLanguage;
            topNavDropdown.getLanguageStatus = getLanguageStatus;
            topNavDropdown.startSubscriptionForLogout = startSubscriptionForLogout;

            if ($rootScope.decodedJwt && $rootScope.decodedJwt.name) {
                getUsername();
                startSubscriptionForLogout();
            }

            function getUsername() {
                var language;

                topNavDropdown.jwtUserFirstName = $rootScope.decodedJwt.firstName;
                topNavDropdown.jwtUserLastName = $rootScope.decodedJwt.lastName;
                language = $rootScope.decodedJwt.language;

                var sessionTranslateLang = sessionStorage.getItem('translationLanguage');

                if(sessionTranslateLang){
                    if (sessionTranslateLang == 'english') {
                        $translate.use('en_US').then(function(){
                            $rootScope.eng = true;
                        });
                    }else {
                        $translate.use('zh_Hant').then(function(){
                            $rootScope.eng = false;
                        });
                    }
                }else{
                    if (language == 'ENGLISH' || !language) {
                        $rootScope.eng = true;
                        $translate.use('en_US');
                    } else {
                        $rootScope.eng = false;
                        $translate.use('zh_Hant');
                    }
                }

            }

            function startSubscriptionForLogout(){
                let topics = [];
                let endpointUrl = config.webserver + '/api/auth/logoutRequest';
                let topicToSend = '/logout/logout-request';
                let newEndPoint = messagingService.initialize(endpointUrl,topicToSend);

                if (newEndPoint) {
                    messagingService.connectionStarted(topicToSend).then(null, null, function () {
                        if (topicToSend) {
                            //console.log('**** starting topic:%s', $scope.topicToSend);
                            messagingService.startListener(topicToSend);
                            topics.push(topicToSend);
                            topicToSend = "";
                        }
                    });
                }
                else {
                    messagingService.startListener(topicToSend);
                }
                messagingService.receiveMessage(topicToSend).then(null, null, function (data) {
                    //console.log(data);
                    let value = data.value.split(';');
                    if(data.topic === '/logout/logout-request' && value[0] === $rootScope.decodedJwt.name && value[1] === $rootScope.hostIP) {
                        logout();
                    }
                });
            }


            function logout () {
                if(store.get(jwtTokenKey)) {
                    $rootScope.$emit('logout');
                    sessionStorage.removeItem('translationLanguage');
                }
                else{
                    $state.reload();
                }
            }

            function changeLanguage (arg) {
                if(arg === 'chinese') {
                    $translate.use('zh_Hant').then(function(){
                        $rootScope.eng = false;
                    });
                }
                else  if(arg === 'english') {
                    $translate.use('en_US').then(function(){
                        $rootScope.eng = true;
                    });
                }

                sessionStorage.setItem('translationLanguage', arg);
            }

            function getLanguageStatus () {
                return $rootScope.eng;
            }
        }

        return directive;
    }
})();