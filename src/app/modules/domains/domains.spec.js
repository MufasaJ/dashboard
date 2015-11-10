describe('Controller: DomainsController', function() {

    var $scope;
    var $controller,
        httpBackend,
        q,
        deferred,
        $stateParams,
        $state,
        domains = [{id: 1}],
        error = 'error',
        domainsLoader,
        errorHandler;

    beforeEach(module('qorDash.core'));
    beforeEach(module('qorDash.auth'));
    beforeEach(module('qorDash.loaders'));
    beforeEach(module('qorDash.domains'));



    beforeEach(function() {
        domainsLoader = {
            load: function() {
                deferred = q.defer();
                return deferred.promise;
            }
        };
        errorHandler = {
            showError: function(error) {
                return error;
            }
        };
        $state = {
            go: function(path) {
                return path;
            },
            current: {
                name: ''
            }
        };
    });



    beforeEach(function () {
        inject(function(_$rootScope_, _$controller_, _dataLoader_, _user_, $httpBackend, $q, _$state_)  {
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
            spyOn(domainsLoader, 'load').and.callThrough();
            spyOn(_user_, 'hasAccessTo').and.returnValue(true);
            spyOn(_$state_, 'go').and.returnValue(true);
            spyOn($state,'go').and.callThrough();
            _$controller_('DomainsController', {$scope: $scope, errorHandler: errorHandler, $state: $state, $stateParams: $stateParams, domainsLoader: domainsLoader});
        })
    });


    describe('after loding', function(){
        beforeEach(function() {

        });
        it ('should load domains', function() {
            expect(domainsLoader.load).toHaveBeenCalled();
        });


        describe("after successful loading", function () {
            beforeEach(function() {
                deferred.resolve({data: domains});
            });
            it ('should populate $scope.domains with response.data', function() {
                $scope.$root.$digest();
                expect($scope.domains).toBe(domains);
            });

            describe ('should redirect if domain length == 1 and state == app.domains', function() {
                beforeEach(function() {
                    $state.current.name = 'app.domains';
                });
                it('should redirect to app.domains.domain',function(){
                    $scope.$root.$digest();
                    expect($state.go).toHaveBeenCalledWith('app.domains.domain', {id: 1});
                });

            });

            describe ('should not redirect if domain length !== 1 or state == app.domains', function() {
                beforeEach(function() {
                    $state.current.name = 'app.domain';
                });

                it ('should not redirect to app.domains', function() {
                    $scope.$root.$digest();
                    expect($state.go).not.toHaveBeenCalled();
                });
            });
        });

        describe('after failed response', function() {
            beforeEach(function() {
                spyOn(errorHandler, 'showError').and.callThrough();
                deferred.reject(error);
                $scope.$root.$digest();
            });
            it ('should call errorHandler and populate $scope.error', function() {
                expect(errorHandler.showError).toHaveBeenCalledWith(error);
                expect($scope.error).toBe(error);
            });
        });
    });
});
