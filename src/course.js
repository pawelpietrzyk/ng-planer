/**
 * Created by PPT on 01.01.14.
 */
angular.module('CourseModule', []).controller('CourseController', function($scope, CourseStorage, TrackStorage) {

    $scope.progressValue = 0;
    $scope.current = {};
    $scope.today = function() {
        $scope.current.dt = new Date();
    };
    $scope.today();

    var btnStates = ["btn-success", "btn-danger"];

    var resetBtnState = function() {
        $scope.btn1State = btnStates[0];
        $scope.btn2State = btnStates[0];
        $scope.btn3State = btnStates[0];
        $scope.btn4State = btnStates[0];
    }
    var setBtnState = function(btn, state) {
        resetBtnState();
        if (btn == 1) {
            $scope.btn1State = btnStates[state];
            $scope.queryOption = $scope.queryOptions[0];
            $scope.contentChanged();
        }
        if (btn == 2) {
            $scope.btn2State = btnStates[state];
            $scope.queryOption = $scope.queryOptions[1];
            $scope.contentChanged();
        }
        if (btn == 3) {
            $scope.btn3State = btnStates[state];
            $scope.queryOption = $scope.queryOptions[3];
            $scope.contentChanged();
        }
        if (btn == 4) {
            $scope.btn4State = btnStates[state];
            $scope.editMode = true;
            $scope.editModeChanged();
        }
    }
    $scope.btn1Change = function() {
        setBtnState(1, 1);
    }
    $scope.btn2Change = function() {
        setBtnState(2, 1);
    }
    $scope.btn3Change = function() {
        setBtnState(3, 1);
    }
    $scope.btn4Change = function() {
        setBtnState(4, 1);
    }

    $scope.showAllTracks = false;
    $scope.queryOptions = ["Day","DayFromNow","FromNow","All"];
    $scope.queryOption = "DayFromNow";
    var previousQueryOption = $scope.queryOption;
    $scope.editMode = false;
    $scope.cloneMode = false;
    $scope.toDt = $scope.current.dt;
    function refresh() {
        if ($scope.queryOption == "Day") {
            CourseStorage.getCoursesByQuery(buildQueryDay(),buildSort()).then(function(courses) {
                $scope.courses = courses;
            });
        } else if ($scope.queryOption == "DayFromNow") {
            CourseStorage.getCoursesByQuery(buildQueryFromNow(),buildSort()).then(function(courses) {
                $scope.courses = courses;
            });
        } else if ($scope.queryOption == "All") {
            CourseStorage.getCourses().then(function(courses) {
                $scope.courses = courses;
            });
        }
    }
    function buildQueryDay() {
        var startTime = angular.copy($scope.course.dt);
        startTime.setHours(0);
        startTime.setMinutes(0);
        startTime.setSeconds(0);
        startTime.setMilliseconds(0);
        var endTime = angular.copy($scope.course.dt);
        endTime.setHours(23);
        endTime.setMinutes(59);
        endTime.setSeconds(59);
        endTime.setMilliseconds(0);
        var qStartTime = "\"$gt\": \""+startTime.toJSON()+"\"";
        var qEndTime = "\"$lte\":\""+endTime.toJSON()+"\"";
        var qDateTime = "\"dt\":{"+qStartTime+","+qEndTime+"}";
        var qTrackName = "\"trackname\":\""+$scope.course.trackname+"\"";
        var query = "{"+qDateTime+","+qTrackName+"}";
        return query;
    };
    function buildQueryFromNow() {
        var startTime = angular.copy($scope.course.dt);
        var endTime = angular.copy($scope.course.dt);
        endTime.setHours(23);
        endTime.setMinutes(59);
        endTime.setSeconds(59);
        endTime.setMilliseconds(0);
        var qStartTime = "\"$gt\": \""+startTime.toJSON()+"\"";
        var qEndTime = "\"$lte\":\""+endTime.toJSON()+"\"";
        var qDateTime = "\"dt\":{"+qStartTime+","+qEndTime+"}";
        var qTrackName = "\"trackname\":\""+$scope.course.trackname+"\"";
        var query = "{"+qDateTime+","+qTrackName+"}";
        return query;
    }
    function buildSort() {
        return "{ \"dt\": 1}";
    }

    $scope.editModeChanged = function() {
        if ($scope.editMode) {
            if ($scope.queryOption != "Day") {
                previousQueryOption = $scope.queryOption;
                $scope.queryOption = "Day";
                refresh();
            }
        } else {
            if (previousQueryOption != $scope.queryOption) {
                $scope.queryOption = previousQueryOption;
            }
            $scope.cloneMode = false;
            refresh();
        }

    }
    $scope.changeCloneMode = function () {
        $scope.cloneMode = !$scope.cloneMode;
    }
    $scope.dateChanged = function() {
        refresh();
    }
    $scope.dateTimeChanged = function() {
        if (!$scope.editMode) {
            refresh();
        }
    }
    $scope.contentChanged = function() {
        //console.log('contentChanged: ' + angular.toJson($scope.course));
        if (!$scope.editMode) {
            refresh();
        }
    };
    function cloneCoursesToDate(toDate) {
        var tmpCourses = angular.copy($scope.courses);
        var tmpNew = [];
        var tmpToDt = new Date(toDate);
        $scope.loading = true;
        if (angular.isDate(tmpToDt)) {
            angular.forEach(tmpCourses, function(item) {

                var tmFromDt = new Date(item.dt);

                tmFromDt.setFullYear(tmpToDt.getFullYear());
                tmFromDt.setMonth(tmpToDt.getMonth());
                tmFromDt.setDate(tmpToDt.getDate());
                item.dt = tmFromDt.toJSON();
                item._id = undefined;
                tmpNew.push(item);
            });
            $scope.loading = false;
            //console.log("Date " + tmpToDt);
            //console.log("FromData" + angular.toJson($scope.courses));
            //console.log("Data " + angular.toJson(tmpNew));

            CourseStorage.save(tmpNew).then(function() {
                //refresh();
                $scope.loading = false;
            });
        } else {
            console.log("Is no a date " + tmpDt);
        }

    }
    $scope.cloneSelected = function() {
        cloneCoursesToDate($scope.toDt);
    }
    $scope.save = function() {
        $scope.course.dt.setSeconds(0);
        $scope.course.dt.setMilliseconds(0);
        CourseStorage.save($scope.course).then(function() {
            //$scope.current = {};
            //$scope.clear();
            refresh();
        });
    };

    $scope.edit = function(course) {
        $scope.course = angular.copy(course);

    };
    $scope.remove = function(courseId) {
        CourseStorage.remove(courseId).then(function() {
            refresh();
        });
    };

    $scope.clear = function() {
        $scope.course = angular.copy($scope.current);
    };
    $scope.getTracks = function() {
        return TrackStorage.getTracks().then(function(entries) {
            var tab = [];
            angular.forEach(entries, function(item) {
                tab.push(item.name);
            })
            $scope.allTracks = tab;
            $scope.course.trackname = $scope.allTracks[0];
            refresh();
            return tab;
        });
    };
    $scope.clear();
    $scope.getTracks();
    resetBtnState();
    $scope.btn2State = btnStates[1];


    //selectDefaultTrackName();

});