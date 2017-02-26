angular.module('VoteApp', ['ui.router','ngNotify','angularFileUpload'])

    .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {

        $stateProvider

            .state('home', {
                url: '',
                templateUrl: 'templates/home.html'
            })

            .state('teachers', {
                url: '/teachers',
                templateUrl: 'templates/teachers.html'
            })

            .state('add-teacher', {
                url: '/add-teacher',
                templateUrl: 'templates/add-teacher.html'
            })

            .state('edit-teacher', {
                url: '/edit-teacher/:id',
                templateUrl: 'templates/edit-teacher.html'
            });

        $urlRouterProvider.otherwise("/");

    }]);
