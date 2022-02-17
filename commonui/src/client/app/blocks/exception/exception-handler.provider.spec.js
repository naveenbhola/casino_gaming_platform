/* jshint -W117, -W030 */
describe('wdts.blocks.exception', function() {
    var exceptionHandlerProvider;
    var mocks = {
        errorMessage: 'fake error',
        prefix: '[TEST]: '
    };
    var fatalStub;

    beforeEach(function() {
        bard.appModule('wdts.blocks.exception', function(_exceptionHandlerProvider_) {
            exceptionHandlerProvider = _exceptionHandlerProvider_;
        });
        bard.inject('$rootScope', 'logger');
    });

    bard.verifyNoOutstandingHttpRequests();

    describe('exceptionHandlerProvider', function() {
        it('should have a dummy test', inject(function() {
            expect(true).to.equal(true);
        }));

        it('should have exceptionHandlerProvider defined', inject(function() {
            expect(exceptionHandlerProvider).to.be.defined;
        }));

        it('should have configuration', inject(function() {
            expect(exceptionHandlerProvider.config).to.be.defined;
        }));

        it('should have configuration', inject(function() {
            expect(exceptionHandlerProvider.configure).to.be.defined;
        }));

        describe('with appErrorPrefix', function() {
            beforeEach(function() {
                exceptionHandlerProvider.configure(mocks.prefix);
                fatalStub = sinon.stub(logger, 'fatal').returns();
            });

            it('should have appErrorPrefix defined', inject(function() {
                expect(exceptionHandlerProvider.$get().config.appErrorPrefix).to.be.defined;
            }));

            it('should have appErrorPrefix set properly', inject(function() {
                expect(exceptionHandlerProvider.$get().config.appErrorPrefix)
                    .to.equal(mocks.prefix);
            }));

            it('should throw an error when forced', inject(function() {
                expect(functionThatWillThrow).to.throw();
            }));

            it('manual error is handled by decorator', function() {
                exceptionHandlerProvider.configure(mocks.prefix);
                try {
                    $rootScope.$apply(functionThatWillThrow);
                }
                catch (ex) {
                    expect(ex.message).to.equal(mocks.prefix + mocks.errorMessage);
                    expect(fatalStub.called).to.equal(true);
                }
            });
        });

        describe('without appErrorPrefix', function() {
            it('should not have appErrorPrefix defined', inject(function() {
                expect(exceptionHandlerProvider.$get().config.appErrorPrefix).to.not.be.defined;
            }));

            it('manual error is handled by decorator', function() {
                try {
                    $rootScope.$apply(functionThatWillThrow);
                }
                catch (ex) {
                    expect(ex.message).to.equal(mocks.errorMessage);
                }
            });
        });
    });

    function functionThatWillThrow() {
        throw new Error(mocks.errorMessage);
    }
});
