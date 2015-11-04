describe('Controller: DeploymentController', function() {

    var $scope;
    var $controller,
        httpBackend,
        q,
        $rootScope,
        $location,
        WS_URL = "wss://ops-dev.blinker.com";

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.deployment'));


    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _dataLoader_, _user_, $httpBackend, $q, $state)  {
            q = $q;
            $controller = _$controller_;
            httpBackend = $httpBackend;
            $scope = _$rootScope_.$new();
            spyOn(_dataLoader_, 'init').and.returnValue({
                then: function (next) {
                    next && next()
                }
            });
            httpBackend.expectGET('data/permissions.json').respond('');
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            spyOn($state, 'go').and.returnValue(true);
            _$controller_('DeploymentController', {$scope: $scope, $rootScope: $rootScope, $location: $location, WS_URL: WS_URL});
        })
    });

    describe('after loading', function(){
        it ('should populate $scope.wsTimelineUrl with WS_URL + "/v1/ws/run/timeline1"', function() {
            expect($scope.wsTimelineUrl).toBe(WS_URL + '/v1/ws/run/timeline1');
        });
    });


});
