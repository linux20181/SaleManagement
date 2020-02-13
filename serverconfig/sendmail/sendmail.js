const sendmail = require('sendmail');
 function SendEmail(){ 
        sendmail({
            from: 'cu.pv165081@sis.hust.edu.vn',
            to: 'phamvancu199819998@gmail.com',
            subject: 'test sendmail',
            html: 'Mail of test sendmail ',
          }, function(err, reply) {
            console.log(err && err.stack);
            console.dir(reply);
        });
}
module.exports = SendEmail;
