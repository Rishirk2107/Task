const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendReminderEmail = async (userEmail, taskTitle, reminderDate) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Reminder: ${taskTitle}`,
      html: `
        <h2>Task Reminder</h2>
        <p>This is a reminder for your task:</p>
        <h3>${taskTitle}</h3>
        <p>Scheduled for: ${new Date(reminderDate).toLocaleString()}</p>
        <p>Please check your task manager for more details.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reminder email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending reminder email:', error);
    throw error;
  }
};

module.exports = { sendReminderEmail }; 