import nodemailer from "nodemailer";

const mailSender = async (email:String, title:string, body:string) => {
    try {

        // creating Transporter
        let transporter = nodemailer.createTransport({
            service: process.env.MAIL_SERVICE,
            host: process.env.MAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });


        // send mail
        let info = await transporter.sendMail({
            from: "MxiCoders",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
        });

        console.log("Info -> ", info);
        return info;

    } catch (err:any) {
        console.log(err.message);
        console.log("can't Send the mail.")
    }
};

export default mailSender;