angular.module('VoteApp')

    .factory('TeacherService', ['$http', function ($http) {
        return {
            getTeachers: function () {
                return $http.get('/api/teachers');
            },
            createTeacher: function (formData) {
                return $http.post('/api/teachers', formData);
            },
            removeTeacher: function (teacherId) {
                return $http.delete('/api/teachers/' + teacherId);
            },
            updateTeacher: function (formData) {
                return $http.put('/api/teachers/' + formData._id , formData);
            },
            getTeacher: function (teacherId) {
                return $http.get('/api/teachers/' + teacherId);
            },
            voteTeacher: function (teacher) {
                return $http.post('/api/teachers/vote', teacher);
            }
        }
    }]);