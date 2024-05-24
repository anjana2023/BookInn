import transporter from "../frameworks/servies/mailServices";
const sendMail = async (
  email: string,
  emailSubject: string,
  content: string
) => {
  try {
    const info = await transporter.sendMail({
      from: "BookInn <anjananjana8@gmail.com>",
      to: email,
      subject: emailSubject,
      html: content,
    });

    console.log(`Email sent to ${email} : `, info.messageId);
  } catch (error) {
    console.log("Error in sending mail ", error);
  }
};
export default sendMail;
