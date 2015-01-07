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

var buildToolApp = angular.module('buildTool', ['ngRoute', 'buildTool.services', 'projectTool.datTimeFilter']);

buildToolApp.config(['$routeProvider',
    function($routeProvider){
		$routeProvider
		.when('/', {
			templateUrl: 'view/dashboard.html',
			controller: 'DashboardCtrl'
		})
		.when('/project/:name', {
			templateUrl: 'view/project.html',
			controller: 'ProjectCtrl'
		})
		.when('/project/create/new', {
			templateUrl: 'view/projectConfig.html',
			controller: 'ProjectConfigCtrl'
		})
		.when('/project/:name/config', {
			templateUrl: 'buildTool/projectConfig.html',
			controller: 'ProjectConfigCtrl'
		})
		.when('/repository', {
			templateUrl: 'buildTool/repository.html',
			controller: 'RepositoryListCtrl'
		})
		.when('/repository/edit/:id', {
			templateUrl: 'buildTool/repositoryEdit.html',
			controller: 'RepositoryEditCtrl'
		})
		.when('/repository/create', {
			templateUrl: 'buildTool/repositoryEdit.html',
			controller: 'RepositoryEditCtrl'
		})
		.when('/project/:name/build/:buildId', {
			templateUrl: 'buildTool/build.html',
			controller: 'BuildCtrl'
		})
		;
	}
]);

buildToolApp.controller('DashboardCtrl', [
	'$scope', 'Project',
	function($scope,  Project){

//		authenticate();
		$scope.openAlert = function() {
			$scope.launch("notify", "My Title", "<div>My Content <span style='color:red;'>hellow</span></div>");
		};
		confirmed = function(result) {
			alert(result);
		};

		$scope.projects = Project.query();
	}
]);

buildToolApp.controller('ProjectCtrl', [
	'$scope', '$http', '$routeParams', 'Project', 'Build',
	function($scope, $http, $routeParams, Project, Build){

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
//					tid = setTimeout(checkBuildProgress, 2000);
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

	}
]);
