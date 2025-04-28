
const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
    
    service: 'gmail',  
    auth: {
      user: 'gitty2187@gmail.com', 
      pass: 'g8355%%*#'  
    }
    });
    
    async function main() {
      const info = await transporter.sendMail({
        from: "gitty2187@gmail.com",
        to,
        subject,
        text,
        html: "<b>Hello world?</b>",
      });
    
      console.log("Message sent: %s", info.messageId);
    }
    
    main().catch(console.error);
    
};

export default sendEmail;


