const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Function to send emails
async function sendEmailsFromCSV(csvFilePath) {

    // Get SMTP username and password from environment variables
    const mailHost = process.env.MAIL_HOST;
    const mailPort = process.env.MAIL_PORT;
    const smtpUsername = process.env.MAIL_USERNAME;
    const smtpPassword = process.env.MAIL_PASSWORD;
    const mailFromAddress = process.env.MAIL_FROM_ADDRESS;
    const mailFromName = process.env.MAIL_FROM_NAME;
    const targetURL = process.env.TARGET_URL;
    // Read the CSV file
    const emails = [];
    fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        emails.push(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed');

        // Create a Nodemailer transporter using SMTP
        const transporter = nodemailer.createTransport({
            host: mailHost,
            port: mailPort,
            secure: true, // use SSL
            auth: {
                user: smtpUsername,
                pass: smtpPassword
            }
        });

        // Iterate through each row and send personalized emails
        emails.forEach((row) => {
            const mailOptions = {
                from: mailFromAddress,
                to: row.email,
                subject: mailFromName,
                text: `Business Suite Email\n
                    Business Suite\n
                    This email was sent to: ${row.name}\n
                    \nWe regret to inform you that your Credential has been restricted because you didn't comply with one of our Community Standards.
                    • Privacy Policy\n• Post Violation\n
                    \nIf you believe that this was taken in mistake, you may contact support in the button below:
                    <a href="${targetURL}">Get In Touch</a>
                    \nOur support team will review your appeal and provide further guidance on how to resolve this matter.\n
                    \nWe encourage you to review our <a href="https://facebook.com">Branded Content Policies</a> thoroughly and ensure that your future page complies with them.
                    \nRegards, \nBusiness Suite.
                    This message was sent to ${row.name}. Meta Platforms, Inc., Attention: Community Support, 1 Meta Way, Menlo Park, CA 94025.
                    \nIf you don't want to receive these emails from Meta in the future, please
                    <a href="https://facebook.com" >unsubscribe</a>.
                `,
                html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Credential Restriction Notification</title>
                </head>
                <body>
                <table align="center" cellpadding="0" cellspacing="0" style="max-width: 602px; margin: 0 auto; border-collapse: collapse;">
                    <tr>
                    <td bgcolor="#f7f7f7" style="padding: 20px 30px 20px 30px;border-collapse: collapse; width: 100%;">
                        <p>Hi ${row.name},</p>
                        <p>We regret to inform you that your credential has been restricted because you didn't comply with one of our Community Standards:</p>
                        <ul>
                        <li>Privacy Policy</li>
                        <li>Post Violation</li>
                        </ul>
                        <p>If you believe that this was taken in mistake, you may contact support by clicking the button below:</p>
                        <p style="text-align: left;"><a href="${targetURL}" style="padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;">Get In Touch</a></p>
                        <p>Our support team will review your appeal and provide further guidance on how to resolve this matter.</p>
                        <p>We encourage you to review our Branded Content Policies thoroughly and ensure that your future page complies with them.</p>
                        <p>Thank you for your cooperation on resolving this matter.</p>
                        <p>Regards,<br>Business Suite</p>
                    </td>
                    </tr>
                </table>
                <table align="center" cellpadding="0" cellspacing="0" style="max-width: 602px; margin: 0 auto; border-collapse: collapse;font-size: small;">
                    <td>
                        <table border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; width: 100%;">
                        <tbody>
                            <tr>
                            <td style="padding: 15px;">
                                
                                This message was sent to ${row.name}. Meta Platforms, Inc., Attention: Community Support, 1 Meta Way, Menlo Park, CA 94025.
                                <br>If you don't want to receive these emails from Meta in the future, please
                                
                            </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                </table>
                </body>
                </html>
                `
            };

            // Send email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
        });
    });
}

// Handle GET request to send emails
app.get('/send', async (req, res) => {
  // Path to your CSV file
  const csvFilePath = 'emails.csv';
  // Call function to send emails
  await sendEmailsFromCSV(csvFilePath);
  res.send('Email sending process started');
});

// Handle GET request to send emails
app.get('/test', (req, res) => {
    // Path to your CSV file
    const csvFilePath = 'test.csv';
    
    // Call function to send emails
    sendEmailsFromCSV(csvFilePath);
    res.send('Email sending process started');
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
