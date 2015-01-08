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

var app = angular.module('app', ['ngRoute', 'mobile-angular-ui', 'mobile-angular-ui.gestures']);

app.config(['$routeProvider',
    function($routeProvider){
		$routeProvider
		.when('/', {
			templateUrl: 'home.html',
			controller: 'HomeCtrl',
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

//app.controller('HomeCtrl', function($rootScope, $scope, $controller){
//    $controller('MainController', {$rootScope: $rootScope, $scope: $scope});
//    $rootScope.title = "Home";
//});
//
//app.controller('BuildToolAbstractCtrl', function($rootScope, $scope, $controller){
//    $controller('MainController', {$rootScope: $rootScope, $scope: $scope});
//    $rootScope.title = "Build Tool";
//});
//
//app.controller('ProjectListCtrl', function($rootScope, $scope, $controller, Project){
//    $controller('BuildToolAbstractCtrl', {$rootScope: $rootScope, $scope: $scope});
//    $scope.projects = Project.query();
//});

