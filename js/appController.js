//$(document).on("pagecreate","#pageone",function(){
//    var projects = [];
//    $.ajax({
//        url: "http://gtech.bitnamiapp.com/ProjectTools/app/project"
//    }).then(function(data) {
//        for (var i in data) {
//            $('#projectList > tbody:last').append("<tr><td>" + data[i].name + "</td></tr>");
//            projects = data;
//        }
//    });
//    $("#projectList").delegate('tr',"tap",function(){
//        alert(projects[$(this).index()].name);
//    });
//});

var app = angular.module('app', ['ngRoute', 'mobile-angular-ui', 'mobile-angular-ui.gestures', 'projectTool.dateTimeFilter', 'buildTool.resources']);

app.config(['$routeProvider',
    function($routeProvider){
		$routeProvider
		.when('/', {
			templateUrl: 'view/home.html',
			controller: 'HomeCtrl',
            reloadOnSearch: false
		})
        .when('/buildTool/projects', {
			templateUrl: 'view/buildTool/projectList.html',
			controller: 'ProjectListCtrl',
            reloadOnSearch: false
		})
        .when('/buildTool/project/:name', {
			templateUrl: 'view/buildTool/project.html',
			controller: 'ProjectCtrl',
            reloadOnSearch: false
		})
		;
	}
]);

//
// For this trivial demo we have just a unique MainController
// for everything
//
app.controller('MainController', function($rootScope, $scope){

    $scope.appVersion = "0.1 beta";
    // User agent displayed in home page
    $scope.userAgent = navigator.userAgent;

    // Needed for the loading screen
    $rootScope.$on('$routeChangeStart', function(){
        $rootScope.loading = true;
    });

    $rootScope.$on('$routeChangeSuccess', function(){
        $rootScope.loading = false;
    });

});

app.controller('HomeCtrl', function($rootScope, $scope, $controller){
    $controller('MainController', {$rootScope: $rootScope, $scope: $scope});
    $rootScope.title = "Home";
});

app.controller('BuildToolAbstractCtrl', function($rootScope, $scope, $controller){
    $controller('MainController', {$rootScope: $rootScope, $scope: $scope});
    $rootScope.title = "Build Tool";
});

app.controller('ProjectListCtrl', function($rootScope, $scope, $controller, Project){
    $controller('BuildToolAbstractCtrl', {$rootScope: $rootScope, $scope: $scope});
    $scope.projects = Project.query();
});

app.controller('ProjectCtrl', function($rootScope, $scope, $http, $routeParams, $controller, Project, Build){
    $controller('BuildToolAbstractCtrl', {$rootScope: $rootScope, $scope: $scope});

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

//		var abortTimer = function() {
//			clearTimeout(tid);
//		};

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
