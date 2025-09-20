const { text } = require("express");
const { transporter, renderTemplate } = require("../config/nodemailer"); // Adjust path as needed


exports.WelcomeUser = async (user , verifyLink) =>{
    const mailOptions = {
        from: "adasoni06@gmail.com",
        to:user.email,
        subject: 'Verify Your Email',
        html: `
            <h3> Hi ${user.name}</h3>
            <p> Click below to verify you email address </p>
            <a href="${verifyLink}" style="padding:10px 20px; background-color:#28a745; color:white; text-decoration:none; border-radius:5px;">Verify Email</a>
            <p>If you can’t click the button, copy this URL:</p>
            <p>${verifyLink}</p>
        
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('SignUp email sent!');
        
    } catch (error) {
        console.error('Error sending login email:', error);
    }
    
}

exports.userLoggedIn = async (user,updateLink) => {
    const options = {
        from: "adasoni06@gmail.com",
        to:user.email,
        subject: 'LoggedIn Notification ',
        html : `
            <h3>Hi ${user.name}</h3>
            <p>You SuccessFully Logged In to Your account.</p>
            <p>If this was not You click below to change your password</p>
            <a href="${updateLink}" style="padding:10px 20px; background-color:#28a745; color:white; text-decoration:none; border-radius:5px;">Change Password</a>

            <p>Thank You</p>
        
        `
    }
    try {
        await transporter.sendMail(options);
        console.log('SignIn email sent!');
        

        
    } catch (error) {
        console.error('Error sending login email:', error);
        
    }
}