// define guthub service modules
var buildToolResources = angular.module('buildTool.resources', ['ngResource']);

//buildToolResources.factory('Repository', ['$resource',
//    function($resource) {
//		return $resource('http://gtech.bitnamiapp.com/ProjectTools/app/repository/:id',
//			{},
//			{
//				update: {
//					method: 'PUT'
//				},
//				testConnection: {
//					method: 'PUT',
//					params:{action:'ct'}
//				}
//
//			}
//		);
//	}
//]);
//
buildToolResources.factory('Project', ['$resource',
    function($resource) {
		return $resource('http://gtech.bitnamiapp.com/ProjectTools/app/project/:name',
			{},
			{
				update: {
					method: 'PUT'
				}
			}
		);
	}
]);
//
//buildToolResources.factory('ProjectModule', ['$resource',
//	function($resource) {
//		return $resource('http://gtech.bitnamiapp.com/ProjectTools/app/projectModule/:id',
//				{},
//				{
//					queryByProjectId: {
//						method: 'GET',
//						params: {projectId: 'projectId'},
//						isArray:true
//					},
//					update: {
//						method: 'PUT'
//					}
//				}
//		);
//	}
//]);
//
//buildToolResources.factory('SelectOptionItem', ['$resource',
//    function($resource) {
//		return $resource('http://gtech.bitnamiapp.com/ProjectTools/app/options/:optionName',
//				{},
//				{
//				});
//	}
//]);

buildToolResources.factory('Build', ['$resource',
	function($resource) {
		return $resource('http://gtech.bitnamiapp.com/ProjectTools/app/build/:projectId/:buildId',
  				{},
  				{}
  		);
	}
]);

//buildToolResources.factory('ProjectModuleRevision', ['$resource',
//    function($resource) {
//		return $resource('http://gtech.bitnamiapp.com/ProjectTools/app/moduleRevision/:projectId/:buildId/:moduleId',
//				{},
//				{}
//				);
//	}
//]);
