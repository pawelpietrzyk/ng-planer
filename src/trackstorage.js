/**
 * Created by PPT on 22.12.13.
 */
angular.module("TrackStorageHttpModule", [])
    .constant('URL', 'https://api.mongolab.com/api/1/databases/ppt_data/collections/track')
    .constant('API_KEY', 'uoP_DqveeSjWFrThA4bgkq5GM3Obsaxv')
    .factory('TrackStorage', function($http, URL, API_KEY) {
    var TrackStorage = {};

    function getResponseData(response) {
        return response.data;
    }

    TrackStorage.save = function(trackitem) {
        if (trackitem._id)
        {
            return $http.put(
                URL + '/' + trackitem._id.$oid,
                angular.extend({}, trackitem, {_id:undefined}),
                {params: {apiKey: API_KEY}}
            ).then(getResponseData);
        } else {
            return $http.post(URL, trackitem, {params: {apiKey: API_KEY}}).then(getResponseData);
        }
    };
    TrackStorage.edit = function(trackId) {
        return $http.get(URL + '/' + trackId, {params: {apiKey: API_KEY}}).then(getResponseData);
    };

    TrackStorage.remove = function(trackId) {
        return $http.delete(URL + '/' + trackId, {params: {apiKey: API_KEY}}).then(getResponseData);
    };

    TrackStorage.getTracks = function() {
        //var result = [];

        //return result;
        return $http.get(URL, {params: {apiKey: API_KEY}}).then(getResponseData);
    };
    return TrackStorage;
});