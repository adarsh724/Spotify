const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'adasoni06@gmail.com',
    pass: 'ebia bozi jhkx hmxw'  // Ideally use environment variables!
  }
});

// ✅ Fix: make renderTemplate asynchronous
let renderTemplate = async (data, relativePath) => {
  try {
    const mailHTML = await ejs.renderFile(
      path.join(__dirname, '../views/mailers', relativePath),
      data
    );
    return mailHTML;
  } catch (err) {
    console.log("Error in rendering template:", err);
    throw err;
  }
};

module.exports = {
  transporter,
  renderTemplate
};
