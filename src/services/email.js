require("dotenv").config();
// const sgMail = require('@sendgrid/mail');
const Handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const readMyFileAndReturnPromise = (dirpath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(dirpath, { encoding: "utf-8" }, (err, fileRead) => {
      if (err) {
        reject(err);
      }
      resolve(fileRead);
    });
  });
};

//ES6
// const readFileAndSendEmail = async (
// 	toEmail,
// 	emailHeader,
// 	dataReplacement,
// 	filename
// ) => {
// 	let dirpath = path.join(__dirname, `../views/${filename}.html`)
// 	let readTheFile = await readMyFileAndReturnPromise(dirpath)
// 	const template = Handlebars.compile(readTheFile)
// 	const result = template(dataReplacement)
// 	const msg = {
// 		to: toEmail,
// 		from: process.env.ZULFAH_EMAIL_SENDER, // Use the email address or domain you verified above
// 		subject: emailHeader,
// 		html: result,
// 	};
// 	sgMail
// 		.send(msg)
// 		.then(() => {
// 			return 'sucesss';
// 		})
// 		.catch((err) => {
// 			console.log('error: ', JSON.stringify(err.response.body));
// 			return 'failed';
// 		});
// };

// module.exports = {
// 	readFileAndSendEmail
// };

const nodemailer = require("nodemailer");
const readFileAndSendEmail = async (
  toEmail,
  emailHeader,
  dataReplacement,
  filename
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  let dirpath = path.join(__dirname, `../views/${filename}.html`);
  let readTheFile = await readMyFileAndReturnPromise(dirpath);
  const template = Handlebars.compile(readTheFile);
  const result = template(dataReplacement);

  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to: toEmail,
    subject: emailHeader,
    html: result,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { readFileAndSendEmail };
