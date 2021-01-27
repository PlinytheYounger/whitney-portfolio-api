const express = require('express');
const logger = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
dotenv.config();
const buildPath = path.join(__dirname, '..', 'build');

app.use(logger('dev'));
app.use(cors());

app.use(express.json());
app.use(express.static(buildPath));

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email, 
        pass: process.env.password 
    }
})

app.post('/send', (req, res) => { // FOR PRODUCTION: Make sure to turn "Less secure app access OFF when deployed to https server" https://myaccount.google.com/security
    let mailOptions = {
        from: `${req.body.contactForm.email.value}`,
        to: 'whitney.smith.lee@gmail.com',
        subject: `${req.body.contactForm.subject.value}`,
        name: `${req.body.contactForm.name.value}`,
        html:
        `${req.body.contactForm.message.value}`
    }

    transporter.sendMail(mailOptions, function(err, info) {
        if(err) {
            console.log(err);
            console.log(mailOptions)
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
});


// app.post('/send', (req, res) => {
//     try {
//         const mailOptions = {
//             from: req.body.contactForm.email.value,
//             to: `whitney.smith.lee@gmail.com`,
//             subject: req.body.contactForm.subject.value,
//             name: req.body.contactForm.name.value,
//             html:
//             `<p>${req.body.contactForm.message.value}</p>`
//         };
//         transporter.sendMail(mailOptions, function(err, info) {
//             if (err) {
//                 console.log(err)
//                 console.log(info)
//                 res.status(500).send({
//                     success: false,
//                     message: 'Something went wrong. Try again later'
//                 })
//             } else {
//                 res.send({
//                     success: true,
//                     message: "Thanks for contacting me! I'll get back to you shortly."
//                 })
//             }
//         })
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({
//             success: false,
//             message: 'Something went wrong. Try again later'
//         });
//     }
// });



const port = process.env.PORT || 3001;

app.listen(port, function() {
    console.log(`Express listening on port ${port}`);
})