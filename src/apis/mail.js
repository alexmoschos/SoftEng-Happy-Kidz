var nodeMailer = require('nodemailer');

function sendTextEmail(subject, receiver, text)
{

	var transporter = nodeMailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'happykidz4122@gmail.com',
			pass: 'PROBONAS'
		}
	});
	var mailOptions = {
          from: '"Happy Kidz" <happykidz4122@gmail.com>', // sender address
          to: receiver, // list of receivers
          subject: subject, // Subject line
          html: '<p>'+text+'</p>' // html body
        };

      //gurnaei (error, info) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!GIA KAPOIO LOGO TA GYRNAEI ANAPODA
      return transporter.sendMail(mailOptions);

    }


    function sendPdfEmail(subject, receiver, text, pdfRoute)
    {

     let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
       user: 'happykidz4122@gmail.com',
       pass: 'PROBONAS'
     }
   });
     
     let mailOptions = {
          from: 'happykidz4122@gmail.com', // sender address
          to: receiver, // list of receivers
          subject: subject, // Subject line
          text: text, // plain text body
          html: '<p>'+text+'</p>', // html body
          attachments: [
          {
          	filename: 'ticket',
          	path: pdfRoute,
          	contentType: 'application/pdf'
          }
          ]
        };

      //gurnaei (error, info) !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!GIA KAPOIO LOGO TA GYRNAEI ANAPODA
      return transporter.sendMail(mailOptions) ;
    }



    mail = {
      sendTextEmail: sendTextEmail,
      sendPdfEmail: sendPdfEmail
    };


    module.exports = mail;