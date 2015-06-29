(function() {
    'use strict';

    angular.module('qorDash.configurations')
        .value('services', [
            {
                "service": "blinker",
                "instances": [ "ops-dev", "staging", "production" ],
                "versions":[ "develop", "v1.0", "v1.1" ]
            },
            {
                "service": "vdp",
                "instances": [ "ops-dev", "staging", "production" ],
                "versions":[ "v0.1", "v1.0" ]
            }
        ]);

    editorController.$inject = ['$scope', '$stateParams', 'services', 'domains'];
    function editorController($scope, $stateParams, services, domains) {
        $scope.domain = domains.filter(function (domain) {
            return domain.id == $stateParams.domain;
        })[0];

        $scope.service = services.filter(function (service) {
            return service.service == $stateParams.service;
        })[0];

        $scope.values = [
            {
                "name": "PGHOST",
                "value1": "ops-dev.blinker.io1",
                "value2": "ops-dev.blinker.io2",
                "value3": "ops-dev.blinker.io3"
            },
            {
                "name": "PGPORT",
                "value1": "54321",
                "value2": "54322",
                "value3": "54323"
            },
            {
                "name": "PGUSER",
                "value1": "blinker1",
                "value2": "blinker2",
                "value3": "blinker3"
            },
            {
                "name": "PGDATABASE",
                "value1": "blinkerdb1",
                "value2": "blinkerdb2",
                "value3": "blinkerdb3"
            },
            {
                "name": "PGPASSWORD",
                "value1": "password1",
                "value2": "password2",
                "value3": "password3"
            }
        ];

        $scope.updateValues = function(name, newValue) {
            for (var valueIndex in $scope.values) {
                if ($scope.values[valueIndex].name == name) {
                    $scope.values[valueIndex].value = newValue;
                    return;
                }
            }
        };

        $scope.deleteValue = function(name) {
            for (var valueIndex in $scope.values) {
                if ($scope.values[valueIndex].name == name) {
                    $scope.values.splice(valueIndex, 1);
                    return;                }
            }
        }
    }

    function onEnter() {
        return function (scope, elm, attr) {
            elm.bind('keypress', function (e) {
                if (e.keyCode === 13) {
                    scope.$apply(attr.onEnter);
                }
            });
        };
    }

    function onEsc() {
        return function(scope, elm, attr) {
            elm.bind('keydown', function(e) {
                if (e.keyCode === 27) {
                    scope.$apply(attr.onEsc);
                }
            });
        };
    }

    inlineEdit.$inject = ['$timeout'];
    function inlineEdit($timeout) {
        return {
            scope: {
                model: '=inlineEdit',
                key: '=key',
                handleSave: '&onSave',
                handleCancel: '&onCancel',
                handleDelete: '&onDelete'
            },
            link: function(scope, elm, attr) {
                var previousValue;

                scope.edit = function() {
                    scope.editMode = true;
                    scope.previousValue = scope.model;

                    $timeout(function() {
                        elm.find('input')[0].focus();
                    }, 0, false);
                };
                scope.save = function() {
                    scope.editMode = false;
                    scope.handleSave({name: scope.key, newValue: scope.model});
                };
                scope.cancel = function() {
                    scope.editMode = false;
                    scope.model = previousValue;
                    scope.handleCancel({value: scope.model});
                };

                scope.remove = function(key) {
                    scope.handleDelete({name: key});
                };
            },
            templateUrl: 'inlineEdit.html'
        };
    }

    function addValue() {
        return {
            link: function(scope, element, attrs) {

            },
            templateUrl: 'addNewValue.html'
        }
    }

    angular.module('qorDash.configurations')
        .controller('EditorController', editorController)
        .directive('inlineEdit', inlineEdit)
        .directive('onEnter', onEnter)
        .directive('onEsc', onEsc)
        .directive('addValue', addValue);
})();