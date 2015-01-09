//
// Here is how to define your module
// has dependent on mobile-angular-ui
//
var app = angular.module('mobildApp', [
    'ngRoute',
    'mobile-angular-ui',

    // touch/drag feature: this is from 'mobile-angular-ui.gestures.js'
    // it is at a very beginning stage, so please be careful if you like to use
    // in production. This is intended to provide a flexible, integrated and and
    // easy to use alternative to other 3rd party libs like hammer.js, with the
    // final pourpose to integrate gestures into default ui interactions like
    // opening sidebars, turning switches on/off ..
    'mobile-angular-ui.gestures',

    'buildTool.resources',
    'projectTool.dateTimeFilter'
]);

//
// You can configure ngRoute as always, but to take advantage of SharedState location
// feature (i.e. close sidebar on backbutton) you should setup 'reloadOnSearch: false'
// in order to avoid unwanted routing.
//
app.config(function($routeProvider) {
    $routeProvider.when('/',                          {templateUrl: 'home.html',   controller: 'HomeCtrl',     reloadOnSearch: false});
    $routeProvider.when('/buildTool/projects',        {templateUrl: 'template/buildTool/projects.html', controller: 'ProjectsCtrl', reloadOnSearch: false});
    $routeProvider.when('/buildTool/project/:name',   {templateUrl: 'template/buildTool/project.html',  controller: 'ProjectCtrl', reloadOnSearch: false});
    $routeProvider.when('/lab',                       {templateUrl: 'template/lab/dashboard.html',      controller: 'LabDashCtrl', reloadOnSearch: false});
    $routeProvider.when('/lab/geoLocation',           {templateUrl: 'template/lab/geoLocation.html',      controller: 'LabGeoLocationCtrl', reloadOnSearch: false});
    $routeProvider.when('/lab/accelerometer',           {templateUrl: 'template/lab/accelerometer.html',      controller: 'LabAccelerometerCtrl', reloadOnSearch: false});
});



//
// For this trivial demo we have just a unique MainController
// for everything
//
app.controller('MainController', function($rootScope, $scope){

    // User agent displayed in home page
    $scope.userAgent = navigator.userAgent;

    // Needed for the loading screen
    $rootScope.$on('$routeChangeStart', function(){
        $rootScope.loading = true;
    });

    $rootScope.$on('$routeChangeSuccess', function(){
        $rootScope.loading = false;
    });

    $rootScope.appVersion = "0.1 beta";

});

app.controller('HomeCtrl', function($rootScope, $scope, $controller){
    $controller('MainController', {$rootScope: $rootScope, $scope: $scope});
    $rootScope.title = "Home";
});

app.controller('BuildToolAbsCtrl', function($rootScope, $scope, $controller){
    $controller('MainController', {$rootScope: $rootScope, $scope: $scope});
    $rootScope.title = "Build Tool";
});
app.controller('ProjectsCtrl', function($rootScope, $scope, $controller, Project){
    $controller('BuildToolAbsCtrl', {$rootScope: $rootScope, $scope: $scope});

    $scope.projects = Project.query();
});
app.controller('ProjectCtrl', function($rootScope, $scope, $http, $routeParams, $controller, Project, Build){
    $controller('BuildToolAbsCtrl', {$rootScope: $rootScope, $scope: $scope});

    $scope.project = Project.get({name: $routeParams.name}, function(project){
        $scope.builds = Build.query({projectId: project.id},
                function(builds) {
                    checkBuilds(builds);
        });
    });

    $scope.build = function() {
        $http.get("/ProjectTools/app/project/build/" + $scope.project.name).success(
            function(data){
                if (data.message == undefined) {
                    $scope.builds = Build.query({projectId: $scope.project.id},
                        function(builds) {
                    });
                } else {
                    $scope.launch("notify", "Build notification", data.message);
                }
            }
        );
    };

    var checkBuildProgress = function() {
        $scope.builds = Build.query({projectId: $scope.project.id},
            function(builds) {
                checkBuilds(builds);
        });
    };

    var checkBuilds = function(builds) {
        builds.forEach(function(build){
            if (build.buildStatus != 4 && build.buildStatus != 5) {
//				tid = setTimeout(checkBuildProgress, 2000);
                return;
            }
        });
    };

    $scope.refresh = function() {
        checkBuildProgress();
    };

    $scope.startSchedulerRun = function() {
        $http.get("/ProjectTools/app/project/schedule/1/" + $scope.project.name).success(
            function(data){
                if (data.message == undefined) {
                    $scope.project.schedulerEnabled = 1;
                } else {
                    $scope.launch("notify", "Build notification", data.message);
                }
            }
        );
    };

    $scope.stopSchedulerRun = function() {
        $http.get("/ProjectTools/app/project/schedule/0/" + $scope.project.name).success(
            function(data){
                if (data.message == undefined) {
                    $scope.project.schedulerEnabled = 0;
                } else {
                    $scope.launch("notify", "Build notification", data.message);
                }
            }
        );
    };
});

app.controller('LabAbsCtrl', function($rootScope, $scope, $controller){
    $controller('MainController', {$rootScope: $rootScope, $scope: $scope});
    $rootScope.title = "Lab";
});

app.controller('LabGeoLocationCtrl', function($rootScope, $scope, $controller){
    $controller('LabAbsCtrl', {$rootScope: $rootScope, $scope: $scope});

    $scope.getLocation = function() {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                $scope.position = {
                    "latitude":     position.coords.latitude,
                    "longitude":    position.coords.longitude,
                    "altitude":     position.coords.altitude,
                    "accuracy":     position.coords.accuracy,
                    "alt-accuracy": position.coords.altitudeAccuracy,
                    "heading":      position.coords.heading ,
                    "speed":        position.coords.speed ,
                    "timestamp":    position.timestamp
                };
            },
            function() {
                alert('Error getting location');
            });
    };
});


app.controller('LabAccelerometerCtrl', function($rootScope, $scope, $controller){
    $controller('LabAbsCtrl', {$rootScope: $rootScope, $scope: $scope});

    $scope.getAcceleration = function() {
        navigator.accelerometer.getCurrentAcceleration(
            function(acceleration){
                $scope.acceleration = {
                    "x":acceleration.x,
                    "y":acceleration.y,
                    "z":acceleration.z,
                    "timestamp":acceleration.timestamp,
                };
            },
            function(){
            });
    };
});
