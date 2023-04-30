const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS,
} = process.env;

const oauth2Client = new OAuth2(
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  OAUTH_PLAYGROUND
);

// send mail
const sendEmail = (to, url, txt) => {
  oauth2Client.setCredentials({
    refresh_token: MAILING_SERVICE_REFRESH_TOKEN,
  });
  let heading = "Welcome to Truedrink";
  let content =
    "Thank you for registering with Truedrink. Please click the button below to verify your email address and complete your registration.";
  let subjectHeading = "Confirm your account on Truedrink";
  if (txt == "Reset your password") {
    heading = "Forgot Password?";
    content =
      "We received a request to reset your password for your Truedrink account. If you did not request a password reset, please ignore this email.";
    subjectHeading = "Request for Password Reset";
  }

  const accessToken = oauth2Client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: SENDER_EMAIL_ADDRESS,
      clientId: MAILING_SERVICE_CLIENT_ID,
      clientSecret: MAILING_SERVICE_CLIENT_SECRET,
      refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
      accessToken,
    },
  });

  const mailOptions = {
    from: SENDER_EMAIL_ADDRESS,
    to: to,
    subject: subjectHeading,
    html: `
    <div style="background-color: #f2f2f2;">
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333; background-color: #fff; padding: 20px;"
    >
      <!-- Logo -->
      <tr>
        <td align="center">
          <img
            src="https://res.cloudinary.com/truedrink/image/upload/v1682772681/truedrink/TrueDrink_cropped_page-0001-removebg-preview_acfhed.png"
            alt="Truedrink Logo"
            style="display: block; margin: 0 auto; max-width: 50%;"
          />
        </td>
      </tr>

      <!-- Email content -->
      <tr>
        <td>
          <h1 style="font-size: 24px; font-weight: bold; text-align: center; margin: 30px 0;">${heading}</h1>
          <p style="text-align: justify; margin-bottom: 30px;">
            ${content}
          </p>
          <table border="0" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
            <tr>
              <td align="center">
                <a href=${url} style="background-color: #1abc9c; color: #fff; display: inline-block; font-weight: bold; padding: 10px 20px; text-decoration: none;">${txt}</a>
              </td>
            </tr>
          </table>
          <p>If the button doesn't work for any reason, you can also click on the link below:</p>
          <p style="text-align: justify;">${url}</p>
          <p style="text-align: justify;">
            If you did not register with Truedrink, please ignore this email.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
          <p style="text-align: center;">
            Truedrink &copy; 2023
          </p>
        </td>
      </tr>
    </table>
  </div>
        `,
  };

  smtpTransport.sendMail(mailOptions, (err, infor) => {
    if (err) return err;
    return infor;
  });
};

module.exports = sendEmail;
