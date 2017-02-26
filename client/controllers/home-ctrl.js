angular.module('VoteApp')

    .controller('HomeController', ['$scope', 'TeacherService', 'ngNotify', function ($scope, TeacherService, ngNotify) {

        TeacherService.getTeachers().then(function (response) {
            $scope.teachers = response.data;
        });

        $scope.sortTeachers = function (teacher) {
            return teacher.positiveVoteCounter - teacher.negativeVoteCounter;
        };

        $scope.vote = function (voteType, teacher) {
            var lastVote = JSON.parse(localStorage.getItem(teacher._id));

            //Daha önce hiç oy kullanılmamışsa ya da kullanılan oy şu ankinden farklıysa
            if(lastVote == null || lastVote != voteType){
                teacher.isPositive = voteType != 0;

                TeacherService.voteTeacher(teacher).then(function (response) {

                    if (response.data.error) {
                        ngNotify.set(response.data.message, "error");
                    } else {
                        localStorage.setItem(teacher._id , voteType != 0);
                        TeacherService.getTeachers().then(function (response) {
                            $scope.teachers = response.data;
                        });
                    }
                });
            } else {
                ngNotify.set("Sadece bir kez oy kullanabilirsiniz!", "error");
            }
        }
    }]);
