//var multer = require('multer'); // v1.0.5
var multiparty = require('multiparty');
var cp = require('./Copy');

/*
 @arg0: String, target file directory for uploaded file
 @arg1: Integer, file size limit (MB)
 */
module.exports = function (targetDestination, fileSizeLimit, req, res, callback) {

    // create instance of multiparty
    var form = new multiparty.Form();

    // handle and parse form data from request
    form.parse(req, function (err, fields, files) {

        if (!err) {
            /*
             If file size lower than 2MB
             */
            if (files.file[0].size < (fileSizeLimit * 1024 * 1024)) {

                var newFileName = files.file[0].originalFilename;

                cp(files.file[0].path, targetDestination + newFileName, function (err, file) {
                    if (!err) {
                        callback({"error": false, "data": newFileName});
                    }
                    else callback({"error": true, "message": err.message});
                });
            }
            else callback({"error": true, "message": "File size must lower than "})
        }
        else {
            callback({"error": true, "message": err.message});
        }

    });

};
