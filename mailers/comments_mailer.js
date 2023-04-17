const nodeMailer = require('../config/nodemailer');

//this is the another way of exporting method

exports.newComment = (comment) =>{
    console.log(comment);

    nodeMailer.transporter.sendMail({
        from:'venky.balusani6@gmail.com',
        to: comment.user.email,
        subject: "Yup! this is done",
        html:'<h1>recieved my first mail in project</h1>'
    },(err,info)=> {
        if(err){
            console.log('Error in sending mail',err);
            return;
        }
        console.log('message sent!',info);
        return;

    });
}