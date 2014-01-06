/**
 * Created by PPT on 22.12.13.
 */
angular.module('TrackModule', []).controller('TrackController', function($scope, TrackStorage) {
    $scope.currentTrackEntry = {};
    $scope.trackEntries = TrackStorage.getTracks();

    function refresh() {
        TrackStorage.getTracks().then(function(trackEntries) {
            $scope.trackEntries = trackEntries;
        });
    }

    $scope.getLocation = function(val) {
        return TrackStorage.getLocation(val);
    }
    $scope.getTrackName = function()
    {
        if (!$scope.trackitem.name)
        {
            $scope.trackitem.name = $scope.trackitem.begin + '-' + $scope.trackitem.end;
        }
        return $scope.trackitem.name;
    }

    $scope.save = function() {
        $scope.getTrackName();
        TrackStorage.save($scope.trackitem).then(function() {
            $scope.currentTrackEntry = {};
            $scope.clear();
            refresh();
        });
    };

    $scope.edit = function(trackitem) {
        $scope.trackitem = angular.copy(trackitem);

    };
    $scope.remove = function(trackId) {
        TrackStorage.remove(trackId).then(function() {
            refresh();
        });
    };

    $scope.clear = function() {
        $scope.trackitem = angular.copy($scope.currentTrackEntry);
    };

    $scope.clear();
    refresh();
});
