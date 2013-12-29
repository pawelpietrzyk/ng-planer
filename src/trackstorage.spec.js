/**
 * Created by pawel.pietrzyk on 24.12.13.
 */

describe('Async track storage', function() {
    var URL, API_KEY;
    var $scope, $httpBackend;
    var trackStorage;

    beforeEach(module('TrackStorageHttpModule'));
    beforeEach(inject(function(_$rootScope_, _$httpBackend_, _TrackStorage_, _URL_, _API_KEY_) {
        $scope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        trackStorage = _TrackStorage_;
        URL = _URL_;
        API_KEY = _API_KEY_;
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
    function withUrl(urlSuffix) {
        return URL + urlSuffix + '?apiKey=' + API_KEY;
    }
    function onFail(reason) {
        throw reason;
    }
    var testTrack = {_id: { $oid: '123'}, begin: 'lublin'};

    it('save', function() {
        $httpBackend.expectPOST(withUrl('')).respond(testTrack);

        trackStorage.save({begin: 'lublin'}).then(function(trackEntry) {
            expect(trackEntry._id.$oid).toEqual('123');
        }, onFail);

        $httpBackend.flush();
    });

    it('update', function() {
        $httpBackend.expectPUT(withUrl('/123')).respond(testTrack);

        trackStorage.save(testTrack).then(function(savedTrack) {
           expect(savedTrack._id.$oid).toEqual('123');
        }, onFail);

        $httpBackend.flush();
    });

    it('edit', function() {
        $httpBackend.expectGET(withUrl('/123')).respond(testTrack);

        trackStorage.edit('123').then(function(editTrack) {
            expect(editTrack.begin).toEqual('lublin');
        }, onFail);

        $httpBackend.flush();
    })

    it('remove', function() {
        $httpBackend.expectDELETE(withUrl('/123')).respond(testTrack);

        trackStorage.remove('123').then(function(removedTrack) {
            expect(removedTrack._id.$oid).toEqual('123');
        }, onFail);

        $httpBackend.flush();
    })

    it('getItems', function() {

        $httpBackend.expectGET(withUrl('')).respond([testTrack]);

        trackStorage.getTracks().then(function(trackEntries) {
            expect(trackEntries[0]._id.$oid).toEqual('123');
        }, onFail);
        $httpBackend.flush();
    });

})
