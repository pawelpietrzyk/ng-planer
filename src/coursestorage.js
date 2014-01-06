/**
 * Created by PPT on 01.01.14.
 */
angular.module("CourseStorageHttpModule", [])
    .constant('URLCOURSE', 'https://api.mongolab.com/api/1/databases/ppt_data/collections/course')
    .constant('API_KEY', 'uoP_DqveeSjWFrThA4bgkq5GM3Obsaxv')
    .factory('CourseStorage', function($http, URLCOURSE, API_KEY) {
        var CourseStorage = {};

        function getResponseData(response) {
            return response.data;
        }

        CourseStorage.save = function(course) {
            if (course._id)
            {
                return $http.put(
                    URLCOURSE + '/' + course._id.$oid,
                    angular.extend({}, course, {_id:undefined}),
                    {params: {apiKey: API_KEY}}
                ).then(getResponseData);
            } else {
                return $http.post(URLCOURSE, course, {params: {apiKey: API_KEY}}).then(getResponseData);
            }
        };
        CourseStorage.edit = function(courseId) {
            return $http.get(URLCOURSE + '/' + courseId, {params: {apiKey: API_KEY}}).then(getResponseData);
        };

        CourseStorage.remove = function(courseId) {
            return $http.delete(URLCOURSE + '/' + courseId, {params: {apiKey: API_KEY}}).then(getResponseData);
        };

        CourseStorage.getCourses = function() {
            return $http.get(URLCOURSE, {params: {apiKey: API_KEY}}).then(getResponseData);
        };
        CourseStorage.getCoursesByQuery = function(query, sort) {
            return $http.get(URLCOURSE, {params: {apiKey: API_KEY, q: query, s: sort}}).then(getResponseData);
        };
        return CourseStorage;
    });