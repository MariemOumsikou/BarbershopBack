const nodemailer = require("nodemailer");
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

const transporter = nodemailer.createTransport({
  host: process.env.Host,
  port: 2525,
  secure: false, 
  auth: {
    user: process.env.User,
    pass: process.env.Pass,
  },
});


app.post('/api/send-comment', (req, res) => {
  const { fullname, mailAddress, message} = req.body;

  transporter
      .sendMail({
          from: {
            name: fullname,
            address: mailAddress
          },
          to: process.env.Barbershop,
          subject: 'Comment',
          text: `You have a new comment. Check details:
          Full Name: ${fullname}
          Message: ${message}`,
      })
      .then(() => {
          console.log('Email sent successfully');
          res.status(200).send('Email sent successfully');
      })
      .catch((error) => {
          console.error('Error sending email:', error);
          res.status(500).send('Error sending email');
      });
});

app.post('/api/send-email', (req, res) => {
  const { fullname, mailAddress, phoneNumber, date, service } = req.body;

  transporter
      .sendMail({
          from: {
            name: 'BarberShop',
            address: process.env.Barbershop
          },
          to: process.env.BarbershopRequest,
          subject: 'New Appointment',
          text: `You have a new appointment. Check the client details:
          Full Name: ${fullname}
          Email: ${mailAddress}
          Phone Number: ${phoneNumber}
          Date: ${date}
          Service: ${service}`,
      })
      .then(() => {
          console.log('Email sent successfully');
          res.status(200).send('Email sent successfully');
      })
      .catch((error) => {
          console.error('Error sending email:', error);
          res.status(500).send('Error sending email');
      });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});