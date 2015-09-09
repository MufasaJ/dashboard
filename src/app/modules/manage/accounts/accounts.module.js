(function () {
    'use strict';

    var module = angular.module('qorDash.manage.accounts', [
        'ui.router'
    ]);

    module.config(appConfig);

    appConfig.$inject = ['$stateProvider'];

    function appConfig($stateProvider) {
        $stateProvider
            .state('app.manage.accounts', {
                url: '/accounts',
                templateUrl: 'app/modules/manage/accounts/accounts.html',
                controller: 'AccountsController',
                authenticate: true
            });
    }
})();