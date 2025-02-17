// const nodemailer = require('nodemailer'); 

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   secure: false, // true for port 465, false for other ports
    //   auth: {
    //     user: "maddison53@ethereal.email",
    //     pass: "jn7jnAPss4f63QBp6D",
    //   },
    service: 'gmail',  // For example, using Gmail
    auth: {
      user: 'gitty2187@gmail.com', // Your email address
      pass: 'g8355%%*#'   // Your email password or App Password if 2FA is enabled
    }
    });
    
    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: "gitty2187@gmail.com",
        to,
        subject,
        text,
        html: "<b>Hello world?</b>",
      });
    
      console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }
    
    main().catch(console.error);
    
};

export default sendEmail;


