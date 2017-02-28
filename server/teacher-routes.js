/**
 * Created by Onur on 26.2.2017.
 */

var Teacher = require("./Teacher");
var uploader = require("./Upload");
var requestIp = require('request-ip');
var fs = require('fs');

module.exports = function (restful, app) {

    var TeacherResource = restful.model('Teacher', Teacher)

        .methods(["get", "post", "put", "delete"]);

    TeacherResource
        .route('imageUpload.post', function (req, res) {
            var sizeLimit = 3; //3MB
            try {
                fs.accessSync(__base + 'client/build');
                uploader(__base + "client/build/assets/images/", sizeLimit, req, res, function (response) {
                    res.json(response);
                })
            } catch (e) {
                uploader(__base + "client/assets/images/", sizeLimit, req, res, function (response) {
                    res.json(response);
                })
            }
        })
        .before('vote.post', function (req, res, next) {
            req.clientIp = requestIp.getClientIp(req);
            next();
        })
        .route('vote.post', function (req, res) {
            var isFound = false;
            var multiVote = false;
            var userIpAddress = req.clientIp;

            TeacherResource.findById(req.body._id, function (err, teacher) {
                if (err) {
                    return res.json({error: true, message: "Hoca bulunurken bir sorun oluştu."});
                } else {

                    teacher.votes.some(function (vote) {
                        if (vote.ipAddress == userIpAddress) {
                            isFound = true;
                            if (vote.isPositive == req.body.isPositive) {
                                multiVote = true;
                            } else {
                                vote.isPositive = req.body.isPositive;

                                if(req.body.isPositive){
                                    teacher.positiveVoteCounter++;
                                    teacher.negativeVoteCounter--;
                                } else {
                                    teacher.positiveVoteCounter--;
                                    teacher.negativeVoteCounter++;
                                }
                            }
                        }
                    });

                    if (multiVote) {
                        return res.json({error: true, message: "Sadece bir kere oy kullanabilirsiniz!"});
                    }

                    if (!isFound) {
                        teacher.votes.push({
                            ipAddress: userIpAddress,
                            isPositive: req.body.isPositive
                        });

                        if (req.body.isPositive) {
                            teacher.positiveVoteCounter++;
                        } else {
                            teacher.negativeVoteCounter++;
                        }
                    }

                    teacher.save(function (err) {
                        if (err) {
                            return res.json({error: true, message: "Hoca kaydedilirken bir sorun oluştu."});
                        } else {
                            return res.json({message: "Başarıyla oy verildi."});
                        }
                    });

                }
            });
        })

        .register(app, '/api/teachers');

};
