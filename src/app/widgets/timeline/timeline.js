(function () {
    'use strict';

    angular
        .module('qorDash.widget.timeline')
        .controller('TimelineController', timelineController)
        .directive('qlTimeline', qlTimeline);

    function qlTimeline($timeout, $window) {
        var adaptHeight = function (element) {
            element.height(element.parent().parent().parent().height());
        };

        return {
            link: function (scope, element, attrs, ctrl) {
                $timeout(function () {
                    adaptHeight(element);
                    scope.onresize = function () {
                        adaptHeight(element);
                    };
                    angular.element($window).bind('resize', function () {
                        scope.onresize();
                    });
                });
            }
        }
    }

    function timelineController ($scope, $rootScope, $timeout, terminal) {
        // List of all events
        $scope.events = [];

        // Stores opened terminals to push input strings
        $scope.openedTerminals = {};

        var socketMessage = function (event) {
            parseInput(event.data);
            var body = angular.element('body')[0];
            body.scrollTop = body.scrollHeight
        };

        // Get WebSocket url from attribute
        var ws = new WebSocket($scope.wsUrl);

        // Handle messages from WebSocket
        ws.onmessage = socketMessage;

        $scope.$on("$destroy", function () {
            ws.close();
        });

        $rootScope.$on('timeline:newWsUrl', function (event, newUrl) {
            ws.close();
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.events = [];
                    $scope.allMessages = {};
                });
            });
            try {
                ws = new WebSocket(newUrl);
                ws.onmessage = socketMessage;
            } catch (e) {
                alert('Wrong WebSocket url' + e);
            }
        });

        // Create Event object from input string

        var createEvent = function (input, event_icon_class) {
            return {
                title: input[3],
                timestamp: input[2],
                text: input[4],
                event_icon_class: event_icon_class,
                id: btoa(input[3]),
                isInfoCollapsed: true
            }
        };

        var updateCard = function (title, eventIconClass, time) {
            var card = $('#' + btoa(title).substr(0, 7));
            card.children('span').removeClass('event-icon-primary').addClass(eventIconClass);
            var timeLabel = card.children('section').children('footer').children('ul').children('li').children('a');
            timeLabel.text((time - timeLabel.attr('data-original')) + ' seconds');
        };

        // Store all messages
        $scope.allMessages = {};

        var currentId = '';

        function parseInput(input) {
            var result = input.split(',');

            switch (result[0]) {
                case '****':
                    if (result[1] == '[') {
                        currentId = result[3];
                        $scope.$apply(function () {
                            $scope.events.push(createEvent(result, 'event-icon-primary'));
                        });
                    } else if (result[1] == ']') {
                        updateCard(result[3], 'event-icon-primary', result[2]);
                        currentId = '';
                    }
                    break;
                case '????':
                    if (result[1] == '[') {
                        currentId = result[3];
                        $scope.$apply(function () {
                            $scope.events.push(createEvent(result, 'event-icon-warning'));
                        });
                    } else {
                        updateCard(result[3], 'event-icon-warning', result[2]);
                    }
                    break;
                case '!!!!':
                    if (result[1] == '[') {
                        currentId = result[3];
                        $scope.$apply(function () {
                            $scope.events.push(createEvent(result, 'event-icon-danger'));
                        });
                    } else {
                        updateCard(result[3], 'event-icon-danger', result[2]);
                    }
                    break;
                default:
                    if (input) {
                        // Prevent undefined string
                        if (!$scope.allMessages[currentId]) {
                            $scope.allMessages[currentId] = '';
                        }
                        $scope.allMessages[currentId] += input + '\n';

                        if ($scope.openedTerminals[currentId]) {
                            $scope.openedTerminals[currentId].echo(input);
                        }
                    }
            }
        }

        $scope.showDetails = function (event) {
            var card = $('#' + btoa(event.title).substr(0, 7));
            var domTerminal = card.children('section').children('footer').children('div');
            var _terminal = terminal.initTerminalByObject(domTerminal.children('div').children('div'), {greetings: false, enabled: false});
            var collapseButton = card.children('section').children('footer').children('ul').children('a');

            _terminal.disable();

            if (event.isInfoCollapsed) {
                _terminal.clear();
                _terminal.echo($scope.allMessages[event.title]);
                $timeout(function () {
                    collapseButton.css('visibility', 'visible');
                }, 300);

                $scope.openedTerminals[event.title] = _terminal;
            } else {
                collapseButton.css('visibility', 'hidden');

                delete $scope.openedTerminals[event.title]
            }

            $timeout(function () {
                event.isInfoCollapsed = !event.isInfoCollapsed;
            });
        };
    }

})();
