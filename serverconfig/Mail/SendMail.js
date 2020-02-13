//import nodemail from '../../node_modules/nodemailer';
var nodemailer = require('../../node_modules/nodemailer');
var  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'phamvancu19981998@gmail.com',
      pass: 'bachkhoatrongtoi19982412@'
    }
  });
var options = (sendTo,title,content)=>{
    return(
        {
            from : "SaleManagement",
            to:sendTo,
            subject:title,
            html: content,
        }
    )
}

var sendMail = (sendTo,title,content)=>{
    transporter.sendMail(options(sendTo,title,content), function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Gửi mail thành công !!');
        }
      });
}
module.exports = 
{
    sendMail: sendMail,
}
