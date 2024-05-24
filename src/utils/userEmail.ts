export const otpEmail = (otp: string, name: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 70%;
          margin: 50px auto;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }
        .logo {
          font-size: 1.4em;
          color: #00466a;
          text-decoration: none;
          font-weight: 600;
        }
        .otp-container {
          background: #00466a;
          color: #fff;
          margin: 20px auto;
          width: max-content;
          padding: 10px;
          border-radius: 4px;
        }
        .footer {
          float: right;
          padding: 8px 0;
          color: #aaa;
          font-size: 0.8em;
          line-height: 1;
          font-weight: 300;
        }
        .name{
         font-weight:bold;
        }
        .bold-text {
          font-weight: bold;
      }
      </style>
    </head>
    <body>
      <div class="container">
        <div>
        <div>
       <center> <a href="#" class="logo" style="color: red; text-decoration: none; font-weight: bold;">BookInn</a></center>
    </div>
    
        </div>
        <p><span class="bold-text name" >Hi, ${name}</span></p>
        <p>Welcome to BookInn. Use the following OTP to complete your Sign Up procedures. OTP is valid for 2 minutes</p>
        <div class="otp-container" style="background-color: #ff6347; color: #fff; padding: 10px; border-radius: 4px; text-align: center;">
        ${otp}
    </div>
    
    <p><span >Regards,</span><br />BookInn</p>
    <div class="footer">
        <p>BookInn</p>
        <p>Kochi, Ernakulam, Kerala</p>
        <p>India</p>
    </div>
      </div>
    </body>
    </html>
    `;
};

export const forgotPasswordEmail = (name: string, verificationCode: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          width: 70%;
          margin: 50px auto;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }
        .logo {
          font-size: 1.4em;
          color: #00466a;
          text-decoration: none;
          font-weight: 600;
        }
        .message-container {
          background: #00466a;
          color: #fff;
          margin: 20px auto;
          width: max-content;
          padding: 10px;
          border-radius: 4px;
        }
        .footer {
          float: right;
          padding: 8px 0;
          color: #aaa;
          font-size: 0.8em;
          line-height: 1;
          font-weight: 300;
        }
        .name {
          font-weight: bold;
        }
        .button-container {
          text-align: center;
          padding: 20px 0;
        }
        .reset-button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #ff6347;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div>
          <center><a href="#" class="logo" style="color: red; text-decoration: none; font-weight: bold;">BookInn</a></center>
        </div>
        <p><span class="name">Dear ${name},</span></p>
        <p>We have received a request to reset your password. To reset your password, click the button below:</p>
        <div class="button-container">
          <a href="http://localhost:5173/user/auth/reset_password/${verificationCode}" class="reset-button" style="color: white;">Reset Password</a>
        </div>
        <p>If you didn't request a password reset, you can ignore this email. Your password will remain unchanged.</p>
        <p>Thank you for using our service!</p>
        <div class="footer">
          <p>&copy; 2024 BookInn</p>
        </div>
      </div>
    </body>
    </html>
    `;
};
