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
    $routeProvider.when('/',                            {templateUrl: 'home.html',                              controller: 'HomeCtrl',     reloadOnSearch: false});
    $routeProvider.when('/buildTool/projects',          {templateUrl: 'template/buildTool/projects.html',       controller: 'ProjectsCtrl', reloadOnSearch: false});
    $routeProvider.when('/buildTool/project/:name',     {templateUrl: 'template/buildTool/project.html',        controller: 'ProjectCtrl', reloadOnSearch: false});
    $routeProvider.when('/lab',                         {templateUrl: 'template/lab/dashboard.html',            controller: 'LabDashCtrl', reloadOnSearch: false});
    $routeProvider.when('/lab/geoLocation',             {templateUrl: 'template/lab/geoLocation.html',          controller: 'LabGeoLocationCtrl', reloadOnSearch: false});
    $routeProvider.when('/lab/accelerometer',           {templateUrl: 'template/lab/accelerometer.html',        controller: 'LabAccelerometerCtrl', reloadOnSearch: false});
    $routeProvider.when('/lab/camera',                  {templateUrl: 'template/lab/camera.html',               controller: 'LabCameraCtrl', reloadOnSearch: false});
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

app.controller('LabDashCtrl', function($rootScope, $scope, $controller){
    $controller('LabAbsCtrl', {$rootScope: $rootScope, $scope: $scope});
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

    $scope.watchID = null;

    function onSuccess(acceleration) {
        $scope.$apply(function(){
            $scope.acceleration = {
                "x":acceleration.x,
                "y":acceleration.y,
                "z":acceleration.z,
                "timestamp":acceleration.timestamp,
            };
        });
    };
    function onError() {
        alert('Acceleometer Error!');
    };
    $scope.getAcceleration = function() {
        navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
    };
    $scope.startWatch = function() {
        var options = { frequency: 500 };

        $scope.watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    };
    $scope.stopWatch = function() {
        if ($scope.watchID) {
            navigator.accelerometer.clearWatch($scope.watchID);
            $scope.watchID = null;
        }
    };
});

app.controller('LabCameraCtrl', function($rootScope, $scope, $controller){
    $controller('LabAbsCtrl', {$rootScope: $rootScope, $scope: $scope});

    var pictureSource = navigator.camera.PictureSourceType;   // picture source
    var destinationType = navigator.camera.DestinationType; // sets the format of returned value

    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
        // Uncomment to view the base64-encoded image data
        // console.log(imageData);

        // Get image handle
        //
        var smallImage = document.getElementById('smallImage');

        // Unhide image elements
        //
        smallImage.style.display = 'block';

        // Show the captured photo
        // The in-line CSS rules are used to resize the image
        //
        smallImage.src = "data:image/jpeg;base64," + imageData;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
        // Uncomment to view the image file URI
        // console.log(imageURI);

        // Get image handle
        //
        var largeImage = document.getElementById('largeImage');

        // Unhide image elements
        //
        largeImage.style.display = 'block';

        // Show the captured photo
        // The in-line CSS rules are used to resize the image
        //
        largeImage.src = imageURI;
    }

    function onFail(message) {
      alert('Failed because: ' + message);
    }

    $scope.capturePhoto = function(){
        if (!navigator.camera) {
            app.showAlert("Camera API not supported", "Error");
            return;
        }

        var options =   {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
            encodingType: 0     // 0=JPG 1=PNG
        };

        navigator.camera.getPicture(
            onPhotoDataSuccess,
            onFail,
            options
        );
    };

    $scope.capturePhotoEdit = function(){
        navigator.camera.getPicture(
            onPhotoDataSuccess,
            onFail,
            {
                quality: 20,
                allowEdit: true,
                destinationType: destinationType.DATA_URL
            });
    };

    $scope.getPhoto = function(source) {
        navigator.camera.getPicture(
            onPhotoURISuccess,
            onFail,
            {
                quality: 50,
                destinationType: destinationType.FILE_URI,
                sourceType: source
            });
    };

});
