/* jshint -W117 */

(function () {
    'use strict';

    angular
        .module('wdts.commonui.blocks.messaging')
        .factory('messagingService', messagingService);

    messagingService.$inject = ['$q', '$timeout'];

    /* @ngInject */
    function messagingService($q, $timeout) {
        var service = {
                receiveMessage: receiveMessage,
                startListener: startListener,
                initialize: initialize,
                connectionStarted: connectionStarted,
                disconnect: angular.noop()
            },
            //msgListener = $q.defer(),
            //connectionListener = $q.defer(),
            socket = {
                client: null,
                stomp: null
            };

        // var topics = [];
        var socketURLTopicMap= new Object();
        var stompClientMap = new Object();
        var topicConnectionMap = new Object();
        var topicMsgListenerMap = new Object();

        service.RECONNECT_TIMEOUT = 10000;

        function receiveMessage(topic) {
            if(topicMsgListenerMap[topic])
            return topicMsgListenerMap[topic].promise;
        }

        function connectionStarted(topic) {
            var msgListener = null;
            if(topicMsgListenerMap[topic] != null){
                msgListener = topicMsgListenerMap[topic];
            }else{
                msgListener = $q.defer();
                topicMsgListenerMap[topic]= msgListener;
            }
            return topicConnectionMap[topic].promise;
        }

        var reconnect = function(obj) {
            $timeout(function() {
                reInitializeFailedTopic(obj);
            }, service.RECONNECT_TIMEOUT);
        };

        var getMessage = function(topic, data) {
            var message = JSON.parse(data), out = {};
            //change for CAM-APP websocket
            out.value = message;
            out.topic = topic;
            return out;
        };

        function startListener(topic) {
            var msgListener = null;
            if(topicMsgListenerMap[topic] != null){
                msgListener = topicMsgListenerMap[topic];
            }
            try{
                stompClientMap[topic].subscribe(topic, function (data) {
                    msgListener.notify(getMessage(topic, data.body));
                });
            }catch(e){
                console.log('subscription failed: ' + e.message);
            }
        }

        function initialize(socketUrl,topic) {
            var connectionListener = null;
            socketURLTopicMap[socketUrl]=topic;
            if(topicConnectionMap[topic] != null){
                connectionListener = topicConnectionMap[topic];
            }else{
                connectionListener = $q.defer();
                topicConnectionMap[topic]= connectionListener;
            }
            socket.client = new SockJS(socketUrl);
            socket.stomp = Stomp.over(socket.client);
            stompClientMap[topic] = socket.stomp;
            socket.stomp.connect({}, connectionListener.notify, function(){reconnect(topic);});
            socket.stomp.onclose = function(){reconnect(topic);};

            service.disconnect = function () {
                socket.stomp.disconnect();
            };

            return true;
        }

        var reInitializeFailedTopic = function(topic) {
            for (var i in socketURLTopicMap) {
                if(topic == socketURLTopicMap[i]) {
                    initialize(i, socketURLTopicMap[i]);
                    connectionStarted(topic).then(null, null, function () {
                        service.startListener(topic);
                    });
                }
            }
        };

        return service;
    }
})();
