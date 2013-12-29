/**
 * Created by pawel.pietrzyk on 23.12.13.
 */
describe('track controller', function() {
    var $scope, $controller;
    var trackStorage;
    beforeEach(module('TrackModule'));
    beforeEach(module('TrackStorageHttpModule'));
    beforeEach(inject(function(_$rootScope_, _$controller_, _TrackStorage_) {
        $scope = _$rootScope_;
        $controller = _$controller_;
        trackStorage = _TrackStorage_;
    }));

    it('should initialize scope with empty track collection', function() {
        trackCtrl = $controller('TrackController', {
            '$scope': $scope
        });
        expect($scope.trackitem).toEqual({});
        if ($scope.trackEntries == [])
        {
            expect($scope.trackEntries.length).toEqual(0);
        }
    });

    it('save and refresh', function() {
        var savedTrack;
        var trackCtrl = $controller('TrackController', {
            '$scope': $scope
        });
        /*
        var trackCtrl = $controller('TrackController', {
            '$scope': $scope,
            'TrackStorage': {
                save: function(track) {
                    savedTrack = track;
                    return savedTrack;
                },
                getTracks: function() {
                    return [savedTrack];
                }
            }
        });
        */

        $scope.trackEntry = {begin: 'lublin'};
        $scope.save();
        expect($scope.trackEntries.length).toEqual(1);
        expect($scope.trackEntry).toEqual({});
    })

})
