let fs = require('fs');
const resumeDownload = (req, res)=>{
    try {
        let role= req.role;
        let fileName = req.query.file_name;
        
        res.download(`${__dirname}../../../../resumes/${fileName}`,(err)=>{
            if(err && err.status == 404){
                return res.render('pages/404', {role:role})
            }
        });
    } catch (error) {
        let role = req.role
        res.render('pages/500',{role:role})
    }
}

module.exports = resumeDownload