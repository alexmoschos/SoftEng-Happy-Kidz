var nodeMailer = require('nodemailer');



function sendTextEmail(subject, receiver, text)
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
          from: '"Happy Kidz" <happykidz4122@gmail.com>', // sender address
          to: receiver, // list of receivers
          subject: subject, // Subject line
          text: text, // plain text body
          html: '<p>'+text+'</p>' // html body
      };

      //gurnaei (error, info)


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
          from: '"Happy Kidz" <happykidz4122@gmail.com>', // sender address
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

      //gurnaei (error, info)msE'g'
      return transporter.sendMail(mailOptions);
  }



mail = {
    sendTextEmail: sendTextEmail,
    sendPdfEmail: sendPdfEmail
};


module.exports = mail;



// const nodemailer = require('../lib/nodemailer');

// // Generate SMTP service account from ethereal.email
// nodemailer.createTestAccount((err, account) => {
//     if (err) {
//         console.error('Failed to create a testing account');
//         console.error(err);
//         return process.exit(1);
//     }

//     console.log('Credentials obtained, sending message...');

//     // NB! Store the account object values somewhere if you want
//     // to re-use the same account for future mail deliveries

//     // Create a SMTP transporter object
//     let transporter = nodemailer.createTransport(
//         {
//             host: account.smtp.host,
//             port: account.smtp.port,
//             secure: account.smtp.secure,
//             auth: {
//                 user: account.user,
//                 pass: account.pass
//             },
//             logger: false,
//             debug: false // include SMTP traffic in the logs
//         },
//         {
//             // default message fields

//             // sender info
//             from: '"Pangalink" <no-reply@pangalink.net>',
//             headers: {
//                 'X-Laziness-level': 1000 // just an example header, no need to use this
//             }
//         }
//     );

//     // Message object
//     let message = {
//         // Comma separated list of recipients
//         to: '<gvelegkas41@gmail.com>',

//         // Subject of the message
//         subject: 'Nodemailer is unicode friendly ✔',

//         // plaintext body
//         text: 'Hello to myself!',

//         // HTML body
//         html:
//             '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
//             '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>',

//         // An array of attachments
//         // attachments: [
//         //     // String attachment
//         //     {
//         //         filename: 'notes.txt',
//         //         content: 'Some notes about this e-mail',
//         //         contentType: 'text/plain' // optional, would be detected from the filename
//         //     },

//         //     // Binary Buffer attachment
//         //     {
//         //         filename: 'image.png',
//         //         content: Buffer.from(
//         //             'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/' +
//         //                 '//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U' +
//         //                 'g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC',
//         //             'base64'
//         //         ),

//         //         cid: 'note@example.com' // should be as unique as possible
//         //     },

//         //     // File Stream attachment
//         //     {
//         //         filename: 'nyan cat ✔.gif',
//         //         path: __dirname + '/assets/nyan.gif',
//         //         cid: 'nyan@example.com' // should be as unique as possible
//         //     }
//         // ]
//     };

//     transporter.sendMail(message, (error, info) => {
//         if (error) {
//             console.log('Error occurred');
//             console.log(error.message);
//             return process.exit(1);
//         }

//         console.log('Message sent successfully!');
//         console.log(nodemailer.getTestMessageUrl(info));

//         // only needed when using pooled connections
//         transporter.close();
//     });
// });