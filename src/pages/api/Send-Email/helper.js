const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function main({ to, subject, html }) {
  try {
    if (!to) {
      console.log("❌ No recipient email provided");
      return;
    }

    const info = await transporter.sendMail({
      from: `"PackForRide" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    });

    console.log("✅ Message sent:", info.messageId);
  } catch (error) {
    console.log("❌ Email Error:", error);
  }
}

module.exports = { main };