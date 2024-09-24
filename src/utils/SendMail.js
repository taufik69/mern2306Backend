const nodemailer = require("nodemailer");
const { MakeTemplate } = require("../helper/Template.js");

const sendMail = async (
  FirstName,
  Email_Adress = "taufik.cit.bd@gmail.com",
  opt
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.HOST_MAIL,
        pass: process.env.HOST_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.HOST_MAIL,
      to: `${Email_Adress}`,
      subject: "MERN2306 Backend  👻",
      html: MakeTemplate(FirstName, opt),
    });

    return info;
  } catch (error) {
    console.log("From SendMail Fucntion :", error.code);
  }
};

module.exports = { sendMail };
