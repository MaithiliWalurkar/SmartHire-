# Email Setup Guide for SmartHire

## 📧 Gmail SMTP Setup (Recommended for Development)

### Step 1: Enable 2-Factor Authentication on Your Gmail Account

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "How you sign in to Google", click on **2-Step Verification**
4. Follow the steps to enable 2FA

### Step 2: Generate App Password

1. After enabling 2FA, go back to **Security**
2. Under "How you sign in to Google", click on **App passwords**
3. Select app: **Mail**
4. Select device: **Other (Custom name)**
5. Enter name: **SmartHire**
6. Click **Generate**
7. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Update appsettings.json

Open `SmartHire.API/appsettings.json` and update the EmailSettings:

```json
"EmailSettings": {
  "SmtpServer": "smtp.gmail.com",
  "SmtpPort": "587",
  "SenderEmail": "your-email@gmail.com",
  "SenderPassword": "your-16-char-app-password",
  "SenderName": "SmartHire"
}
```

**Replace:**
- `your-email@gmail.com` with your actual Gmail address
- `your-16-char-app-password` with the app password you generated (remove spaces)

### Step 4: Test the Email

1. Restart your API server
2. Register a new user
3. Check your email inbox for the OTP

---

## 🔐 Security Best Practices

### For Production:

1. **Never commit credentials to Git**
   - Add `appsettings.json` to `.gitignore`
   - Use environment variables or Azure Key Vault

2. **Use User Secrets for Development**
   ```powershell
   cd SmartHire.API
   dotnet user-secrets init
   dotnet user-secrets set "EmailSettings:SenderEmail" "your-email@gmail.com"
   dotnet user-secrets set "EmailSettings:SenderPassword" "your-app-password"
   ```

3. **Use Environment Variables in Production**
   ```bash
   EmailSettings__SenderEmail=your-email@gmail.com
   EmailSettings__SenderPassword=your-app-password
   ```

---

## 📨 Alternative Email Providers

### SendGrid (Recommended for Production)

1. Sign up at https://sendgrid.com/
2. Get API Key
3. Update EmailSettings:
   ```json
   "EmailSettings": {
     "Provider": "SendGrid",
     "ApiKey": "your-sendgrid-api-key",
     "SenderEmail": "noreply@yourdomain.com",
     "SenderName": "SmartHire"
   }
   ```

### AWS SES

1. Set up AWS SES
2. Verify your domain
3. Get SMTP credentials
4. Update EmailSettings with AWS SMTP details

### Mailgun

1. Sign up at https://www.mailgun.com/
2. Get API credentials
3. Update EmailSettings accordingly

---

## 🧪 Testing Without Real Email

If you don't want to set up email yet, the system will automatically fall back to **console logging**. The OTP will be printed in the API terminal.

Just leave the EmailSettings as:
```json
"EmailSettings": {
  "SmtpServer": "smtp.gmail.com",
  "SmtpPort": "587",
  "SenderEmail": "",
  "SenderPassword": "",
  "SenderName": "SmartHire"
}
```

---

## ✅ Verification

After setup, you should see in the API console:
- ✅ `Email sent successfully to user@example.com`

If there's an error:
- ❌ `Error sending email: [error message]`
- The OTP will still be logged to console as fallback

---

## 🎨 Email Template

The email includes:
- Professional HTML design
- Large, centered OTP code
- Expiry information (10 minutes)
- Plain text fallback for email clients that don't support HTML

---

## 📞 Troubleshooting

### "Authentication failed"
- Make sure you're using an **App Password**, not your regular Gmail password
- Verify 2FA is enabled on your Google account

### "SMTP connection failed"
- Check your internet connection
- Verify SMTP server and port are correct
- Some networks block port 587 - try port 465 with SSL

### "Email not received"
- Check spam/junk folder
- Verify the recipient email address is correct
- Check API console for error messages

---

**Need help? Check the API console for detailed error messages!**
