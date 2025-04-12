import nodemailer from 'nodemailer';

const sendEmail=async({email,subject,message})=>{
    const transported=nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        service: process.env.SMTP_SERVICE,
        secure:false,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });
    const options={
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html: message
    };

    await transported.sendMail(options);
}
export {sendEmail}