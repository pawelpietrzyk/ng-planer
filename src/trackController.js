/**
 * Created by PPT on 05.01.14.
 */

var TrackController = function($scope, TrackStorage) {
    $scope.getTracks = function() {
        return TrackStorage.getTracks().then(function(entries) {
            $scope.allTracks = entries;
            return entries;
        });
    };
    $scope.getTracks();

};
