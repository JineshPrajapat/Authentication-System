export const resetPasswordTemplate = (email: string, reset_password_link: string) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        table {
            width: 100%;
            table-layout: fixed;
        }
        .email-container {
            background-color: #ffffff;
            margin: 0 auto;
            width: 100%;
            max-width: 600px;
            padding: 20px;
            border-radius: 8px;
        }
        .email-header {
            text-align: center;
            padding-bottom: 20px;
        }
        .email-header h1 {
            color: #333333;
            font-size: 24px;
        }
        .email-body {
            font-size: 16px;
            color: #333333;
            line-height: 1.6;
        }
        .email-body p {
            margin-bottom: 20px;
        }
        .reset-button {
            background-color: #007bff;
            color: #ffffff;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            font-size: 16px;
            text-align: center;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #888888;
            padding-top: 20px;
        }
        @media (max-width: 600px) {
            .email-container {
                padding: 15px;
            }
            .reset-button {
                padding: 10px 20px;
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <table role="presentation">
        <tr>
            <td>
                <div class="email-container">
                    <div class="email-header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="email-body">
                        <p>Hello,</p>
                        <p>We received a request to reset the password for your account associated with this email address: <strong>${email}</strong>.</p>
                        <p>If you made this request, you can reset your password by clicking the button below. If you didn’t request this, you can ignore this email.</p>
                        <p><a href="${reset_password_link}" class="reset-button">Reset Your Password</a></p>
                        <p>This link will expire in 10 minutes for security purposes.</p>
                        <p>If you have any questions, feel free to reach out to our support team.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2025 Your Company. All rights reserved.</p>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
`;
}
