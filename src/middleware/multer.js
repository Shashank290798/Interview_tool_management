const multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./resumes");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const uploadRes = multer({ storage: storage })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './categoryXL')
    },
    filename: function (req, file, cb ){
        cb(null, Date.now()+"-"+file.originalname);
    }
})

const uploadCategory = multer({storage:storage})

module.exports = {uploadRes, uploadCategory}