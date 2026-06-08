const publicProfileImageUrl = 'https://i.imgur.com/G5yB3yZ.png'; // Example hosted URL

// 2. Define dynamic template parameters
const templateParams = {
    companyName: 'Six Things',
    senderName: 'Vance Solstein',
    senderTitle: 'Founding Partner',
    senderEmail: process.env.SENDER_EMAIL, // For reply-to
    // Pass the actual email from your verifyPayment flow
    userEmail: 'user@example.com', 
    hostedImageUrl: publicProfileImageUrl, // Dynamic hosted image URL
};

// 3. The Responsive HTML Template String (Table-based layout)
const htmlEmailTemplate = `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Welcome to ${templateParams.companyName}</title>
    <style type="text/css">
        /* Main responsive container (600px) */
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; max-width: 100% !important; }
            .content-spacing { padding-left: 20px !important; padding-right: 20px !important; }
            .button { width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; text-align: center !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: rgb(11, 66, 156);">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: rgb(11, 66, 156);">
        <tr>
            <td align="center" style="padding: 30px 0;">
                
                <table class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width: 600px; max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; font-family: Arial, sans-serif; text-align: left;">
                    <tr>
                        <td style="padding: 30px 40px; text-align: center;">
                            <h2 style="margin: 0; font-family: Arial, sans-serif; color: #333333; font-size: 24px; text-align: left;">ST <span style="font-size: 14px; font-weight: normal; color: #666666;">Six Things</span></h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 10px 40px;">
                            <h1 style="margin: 0; color: #333333; font-size: 44px; font-family: Arial, sans-serif; font-weight: bold; line-height: 1.1;">HELLO!</h1>
                        </td>
                    </tr>
                    
                    <tr>
                        <td class="content-spacing" style="padding: 20px 40px; color: #555555; font-size: 16px; font-family: Arial, sans-serif; line-height: 1.6;">
                            <p style="margin: 0 0 15px 0;">Hey there,</p>
                            <p style="margin: 0 0 15px 0;">I’m absolutely thrilled you’re here. When we launched <strong style="color: #333333;">${templateParams.companyName}</strong>, our goal was to create a space where we could promote and empower the impactful ideas, entrepreneurs, creatives and game changers who so often go uncelebrated.</p>
                            
                            <p style="margin: 0 0 15px 0;">We’ve created a space to connect, showcase, and inspire impactful work—and now you’re officially part of it.</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="center" style="padding: 30px 40px; border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0;">
                            <table class="button" cellpadding="0" cellspacing="0" border="0" style="background-color: #fce77d; border-radius: 8px;">
                                <tr>
                                    <td style="padding: 15px 40px; text-align: center;">
                                        <a href="${process.env.YOUR_DOMAIN}/dashboard" target="_blank" style="display: inline-block; text-decoration: none; color: #333333; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; background-color: #fce77d;">
                                            EXPLORE MORE
                                        </a>
                                        </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td class="content-spacing" style="padding: 30px 40px; color: #555555; font-size: 16px; font-family: Arial, sans-serif; line-height: 1.6;">
                            <p style="margin: 0 0 15px 0;">And now that you’re all signed up, we’ll keep you in the loop. Think innovative feature releases, tools, and stories from our vast ecosystem. We’re excited to share these updates, and even better, to get your input.</p>
                            <p style="margin: 0 0 15px 0;">In the meantime, if you have any questions, compliments or concerns — I’m always here.</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td class="content-spacing" style="padding: 20px 40px 40px 40px; background-color: #fafafa; border-top: 1px solid #e0e0e0; text-align: left;">
                            <table cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td width="80" valign="top" style="padding-right: 20px;">
                                        <img src="${templateParams.hostedImageUrl}" alt="${templateParams.senderName}" width="70" height="70" style="width: 70px; height: 70px; border-radius: 50%; display: block; border: 2px solid #ffffff; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                    </td>
                                    <td valign="top" style="color: #333333; font-size: 16px; font-family: Arial, sans-serif; line-height: 1.4;">
                                        <strong style="display: block; font-weight: bold;">${templateParams.senderName}</strong>
                                        <span style="display: block; color: #777777; font-size: 14px;">${templateParams.senderTitle}</span>
                                        <span style="display: block; color: #777777; font-size: 14px;">${templateParams.companyName}</span>
                                        <a href="mailto:${templateParams.senderEmail}" style="color: #666666; font-size: 12px; text-decoration: underline;">Reply to me</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 15px; color: #999999; font-size: 12px; font-family: Arial, sans-serif; line-height: 1.4;">
                            <p style="margin: 0;">This email was sent to ${templateParams.userEmail} because you created an account.</p>
                            <p style="margin: 0;">© ${new Date().getFullYear()} ${templateParams.companyName}. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
                </td>
        </tr>
    </table>
</body>
</html>
`;

export default htmlEmailTemplate;