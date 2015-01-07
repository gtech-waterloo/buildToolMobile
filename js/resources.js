// define guthub service modules
var services = angular.module('buildTool.services', ['ngResource']);

services.factory('Repository', ['$resource',
    function($resource) {
		return $resource('http://gtech.bitnamiapp.com/ProjectTools/app/repository/:id',
			{},
			{
				update: {
					method: 'PUT'
				},
				testConnection: {
					method: 'PUT',
					params:{action:'ct'}
				}

			}
		);
	}
]);

services.factory('Project', ['$resource',
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

services.factory('ProjectModule', ['$resource',
	function($resource) {
		return $resource('http://gtech.bitnamiapp.com/ProjectTools/app/projectModule/:id',
				{},
				{
					queryByProjectId: {
						method: 'GET',
						params: {projectId: 'projectId'},
						isArray:true
					},
					update: {
						method: 'PUT'
					}
				}
		);
	}
]);

services.factory('SelectOptionItem', ['$resource',
    function($resource) {
		return $resource('http://gtech.bitnamiapp.com/ProjectTools/app/options/:optionName',
				{},
				{
				});
	}
]);

services.factory('Build', ['$resource',
	function($resource) {
		return $resource('http://gtech.bitnamiapp.com/ProjectTools/app/build/:projectId/:buildId',
  				{},
  				{}
  		);
	}
]);

services.factory('ProjectModuleRevision', ['$resource',
    function($resource) {
		return $resource('http://gtech.bitnamiapp.com/ProjectTools/app/moduleRevision/:projectId/:buildId/:moduleId',
				{},
				{}
				);
	}
]);
