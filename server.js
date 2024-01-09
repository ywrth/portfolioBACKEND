const express = require("express");
const app = express();
const port = 3000; // You can use any port
const nodemailer = require("nodemailer");

require("dotenv").config();

app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: "*", // Allow all origins
  })
);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

app.post("/send", (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER, // sender address
    to: process.env.EMAIL_TO, // list of receivers
    subject: `${req.body.name} Contacted You!`,
    text: `
      Name: ${req.body.name}
      E-mail address: ${req.body.email}
      Message: ${req.body.message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.json({ status: "error", message: "Error message" });
    } else {
      console.log("Email sent: " + info.response);
      res.json({ status: "success", message: "Email sent successfully" });
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
