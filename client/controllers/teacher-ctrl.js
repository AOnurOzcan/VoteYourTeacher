angular.module('VoteApp')

    .controller('TeacherController', ['$scope', '$state', '$timeout', 'TeacherService', 'FileUploader', 'ngNotify', function ($scope, $state, $timeout, TeacherService, FileUploader, ngNotify) {

        //-------- FILE UPLOAD --------//
        $scope.uploader = new FileUploader({
            url: "api/teachers/imageUpload"
        });

        //Eklenen dosyanın resim olup olmadığını kontrol eden filtre.
        $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        if ($state.is('edit-teacher')) {
            TeacherService
                .getTeacher($state.params.id).then(function (response) {
                $scope.teacher = response.data;
            });
        }

        TeacherService.getTeachers().then(function (response) {
            $scope.teachers = response.data;
        });

        $scope.removeTeacher = function (id) {
            TeacherService.removeTeacher(id).then(function (response) {
                TeacherService.getTeachers().then(function (response) {
                    $scope.teachers = response.data;
                });
            });
        };

        $scope.createTeacher = function (teacher) {
            if ($scope.uploader.queue.length > 0) { //If a file is chosen
                $scope.uploader.queue[0].upload(); //Then start upload.
            } else {
                if (state == 0) {
                    TeacherService.createTeacher(teacher).then(function () {
                        $timeout(function () {
                            $state.go('teachers');
                        }, 1000);
                        ngNotify.set("Hoca başarılı bir şekilde.", "success");
                    });
                }
            }

            //Upload işlemi bittiğinde bu event tetiklenir
            $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
                if (!response.error) {
                    teacher.image = response.data; //Upload edilen resmin adı ilgili değişkene atanır.

                    TeacherService.createTeacher(teacher).then(function () {
                        $timeout(function () {
                            $state.go('teachers');
                        }, 1000);
                        ngNotify.set("Hoca başarılı bir şekilde.", "success");
                    });
                } else { //If there is an error
                    ngNotify.set("Resim yüklenirken bir sorun oluştu. Hata : " + response.message, "error");
                }
            };

            //Resim upload edilemezse
            $scope.uploader.onErrorItem = function (item, response, status, headers) {
                ngNotify.set("Resim yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.", "error");
            };
        };

        $scope.updateTeacher = function (teacher) {
            TeacherService.updateTeacher(teacher).then(function () {
                $timeout(function () {
                    $state.go('teachers');
                }, 1000);
                ngNotify.set("Hoca başarılı bir şekilde düzenlendi", "success");
            });
        }

    }]);
