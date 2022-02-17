(function () {
    'use strict';

    angular
    .module('wdts.commonui.services')
    .factory('tokenHandlingService', tokenHandlingService);

    tokenHandlingService.$inject = [
        '$rootScope', '$location', 'store', 'jwtHelper', '$window', '$state', 'config',
        'authService', 'jwtTokenKey', 'applicationCode', 'accessCode', 'clientId', 'overviewService', 'logger'
    ];

    function tokenHandlingService($rootScope, $location, store, jwtHelper, $window, $state, config,
                                  authService, jwtTokenKey, applicationCode, accessCode, clientId, overviewService, logger) {
        var service = {
            onStateChangeStart: onStateChangeStart,
            onStateChangeSuccess: onStateChangeSuccess,
            checkToken: checkToken,
            setPermGrantedFunc: setPermGrantedFunc,
            checkAccessGroup:checkAccessGroup,
            logout: logout
        };
        var isBind = false;
        service.tokenExpired = false;

        return service;

        function setPermGrantedFunc(func) {
            service.onPermGranded = func;
        }

        function onStateChangeStart(e, to, params) {
            if (to.redirectTo) {
                e.preventDefault();
                $state.go(to.redirectTo, params)
            }

            if(!isBind){
                isBind = true;
                bindEvents();
            }

            setNewRedirectUrl();
            setLoadingViewState(true);

            if ($location.search().access_token) {
                store.set(jwtTokenKey, $location.search().access_token);
                $location.search('access_token', null);
                $location.search('token_type',null);
                $location.search('expires_in',null);
                $location.search('expiresIn',null);
                $location.search('scope',null);
            }

            if (to.data && to.data.requiresLogin) {
                var jwtConfig = store.get(jwtTokenKey);

                if (!jwtConfig || jwtHelper.isTokenExpired(jwtConfig)) {
                    goToRedirectUrl(e);
                } else {
                    setDecodedJwt(jwtConfig);
                    checkPerm(e, to, params);
                }
            }

            verifyToken(to);
        }

        function verifyToken(to){
            // //Take unauthorized user to login page
            let client_id = getClientId(to.url);
            if(to.data) {
                if (to.data.isCashierUI) {
                    client_id = "cash";
                } else if (to.data.isCamUI) {
                    client_id = "cam";
                } else if (to.data.isLoginUI) {
                    client_id = "lgn";
                }
            }
            client_id = client_id ? "client_id=" + client_id : undefined;
            if(client_id && store.get(jwtTokenKey)) {
                authService.getRefreshedToken(client_id).then(function (data) {
                }, function (error) {
                    localStorage.clear();
                    $window.location.href = jwtHelper.decodeToken(store.get(jwtTokenKey)).name === "ppmaster" ? config.ppmasterLoginUrl : (config.webserver + "/api/auth/oauth/authorize?grant_type=implicit&"+client_id+"&scope=read&response_type=token&redirect_uri=" + $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/#/');
                });
            }
        }

        function logout(){
            let username = jwtHelper.decodeToken(store.get(jwtTokenKey)).name;
            if(store.get(jwtTokenKey)) {
                let redirectUrl = config.authentication_type === 'LDAP' ? username === "ppmaster" ? config.ppmasterLoginUrl : $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/#/'
                    :username === "ppmaster" ? config.ppmasterLoginUrl :config.webserver + "/api/auth/saml/logout?redirect_uri=" + $location.absUrl();

                overviewService.ppMasterLogout().then(function (data) {
                    removeAndRedirect(redirectUrl,username);
                }, function error() {
                    removeAndRedirect(redirectUrl,username);
                    logger.info('logout issue in service');
                });
            }
            else{
                $state.reload();
            }
        }

        function removeAndRedirect(redirectUrl,username) {
            store.remove(jwtTokenKey);
            $window.location.href = redirectUrl;
            if (config.authentication_type === 'LDAP' && username !== "ppmaster") {
                $state.reload();
            }
        }

        function bindEvents(){
            var evt = $rootScope.$on("logout", logout);
            $rootScope.$on("$destroy", evt);
        }

        function getClientId(url){
            //Map of app root url and client_id
            let obj = {
                "configuration": "conf",
                "overview": "cmr",
                "tabledashboard": "tab",
                "alert": "alrt",
                "player": "plr",
                "treasury": "trs"
            };
            return obj[Object.keys(obj).find((key) => {
                let match = url.match(key);
                return key === (match !== null ? match[0] : "");
            })];
        }

        function onStateChangeSuccess() {
            setLoadingViewState(false);
        }

        function checkToken() {
            if (store.get(jwtTokenKey)) {
                var tokenExpirationTime = jwtHelper.getTokenExpirationDate(store.get(jwtTokenKey)).getTime();
                var currentTime = new Date().getTime();

                if (tokenExpirationTime - currentTime < 60000 && !service.tokenExpired) {
                    service.tokenExpired = true;
                    authService.getRefreshedToken("client_id=" + clientId).then(onNewToken, onInvalidToken);
                }
            }
        }

        function onNewToken(data) {
            service.tokenExpired = false;

            if (data.access_token) {
                store.set(jwtTokenKey, data.access_token);
                setDecodedJwt(data.access_token);
                checkPerm();
            } else {
                onInvalidToken();
            }
        }

        function checkPerm(e, to, params) {
            var app = getApp();

            if (app) {
                $rootScope.appPermissions = app.permissions;
                checkAppPerm(app, e, params);
                to && checkPagePerm(app, e, to);
                checkAccessGroup(app,e);
            }

            else if(jwtTokenKey !== 'jwt'){
                goToAccessDenied(e);
            }
        }

        function checkAppPerm(app, e, params) {
            if ((_.contains(app.permissions, accessCode) && _.contains($rootScope.decodedJwt.applications, applicationCode)) || $rootScope.decodedJwt.superuser) {
                console.log("Permission for application");

                if(jwtTokenKey === 'jwt_tbldash' && app.topologyIds.indexOf(params.tableId) === -1 && !$rootScope.decodedJwt.superuser) {
                    goToAccessDenied(e);
                }

            } else {
                goToAccessDenied(e);
            }
        }

        function checkPagePerm(app, e, to) {
            let pagePerm = to.data.permission;
            pagePerm = pagePerm && typeof pagePerm === "string" ? pagePerm.split() : pagePerm;
            if ((pagePerm && _.intersection(app.permissions, pagePerm).length) || $rootScope.decodedJwt.superuser || !pagePerm) {
                $rootScope.access = true;
                console.log("Permission for Page");
                service.onPermGranded && service.onPermGranded(app);
            } else {
                goToAccessDenied(e);
            }
        }

        function getApp() {
            return _.findWhere($rootScope.decodedJwt.authorities, {
                "applicationCode": applicationCode
            });
        }


        function checkAccessGroup(app,e){
            if(jwtTokenKey === 'jwt_cam' || jwtTokenKey === 'jwt_cash'){
                if(app.topologyIds.length === 0){
                    goToAccessDenied(e);
                }
            }
        }

        function goToAccessDenied(e) {
            e && e.preventDefault();
            $rootScope.access = false;
            $state.go('accessdenied');
        }

        function goToRedirectUrl(e) {
            e && e.preventDefault();
            $window.location.href = $rootScope.windowRedirect;
        }

        function setDecodedJwt(jwtConfig) {
            $rootScope.jwt = jwtConfig;
            $rootScope.decodedJwt = jwtHelper.decodeToken(jwtConfig);
            $rootScope.jwtUserName = $rootScope.decodedJwt.name;
            $rootScope.jwtUserId = $rootScope.decodedJwt.userId;
            $rootScope.hostIP = $rootScope.decodedJwt.host;
            $rootScope.superuser = $rootScope.decodedJwt.superuser;
        }

        function onInvalidToken() {
            console.log("Expired or Invalid Token");
            localStorage.clear();
            $state.reload();
        }

        function setLoadingViewState(state) {
            $rootScope.loadingView = state;
        }

        function setNewRedirectUrl() {
            console.log($location.absUrl());
            var redirectTo = $location.protocol() + '://' +
                $location.host() + ':' +
                $location.port() + '/#';

            if(clientId == 'tab'){
                $rootScope.windowRedirect = authenticationType() + encodeURIComponent($location.absUrl());
            }

            else {
                if(config.authentication_type == 'LDAP') {
                    console.log(authenticationType() + encodeURIComponent($location.absUrl()));
                    $rootScope.windowRedirect = authenticationType() + encodeURIComponent($location.absUrl());
                }

                else{
                    $rootScope.windowRedirect = authenticationType() + redirectTo;
                }
            }
        }

        function findMultipleItemsInArr(arr, items) {
            !Array.isArray(items) && (items = []);
            return items.every(function(item) {
                return arr.indexOf(item) >= 0;
            });
        }

        function authenticationType(){

            return config.authentication_type == 'LDAP' ? config.webserver + '/ldaplogin.html'+
                "?client_id=" + clientId +
                "&redirect_uri=" :
                config.auth.oauthAuthorize +
                "?grant_type=implicit" +
                "&client_id=" + clientId +
                "&scope=read" +
                "&response_type=token" + "&redirect_uri=" ;
        }
    }
})();