# 📧 SMTP Setup Guide - Brevo (Sendinblue)

## Why Gmail SMTP Fails on Render

**Gmail SMTP uses port 587 which is blocked on Render's free tier** to prevent spam. This causes `ETIMEDOUT` errors.

### Solution: Use Brevo (Sendinblue)

Brevo is a free, reliable SMTP service that works perfectly with Render.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Brevo Account

1. Go to [https://www.brevo.com/](https://www.brevo.com/)
2. Sign up for a **FREE** account
3. Verify your email address

### Step 2: Get SMTP Credentials

1. Log in to Brevo dashboard
2. Click your name (top right) → **SMTP & API**
3. Click **SMTP** tab
4. You'll see:
   ```
   SMTP server: smtp-relay.brevo.com
   Port: 587
   Login: your-email@example.com
   SMTP Key: xkeysib-xxxxxxxxxxxxxx
   ```

### Step 3: Update Render Environment Variables

Go to your Render dashboard → Your service → **Environment**

Add these variables:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-login-email@example.com
SMTP_PASSWORD=xkeysib-your-actual-smtp-key
EMAIL_FROM=mishrilalparihar30221@gmail.com
RECIPIENT_EMAIL=mishrilalparihar30221@gmail.com
```

**Important:**
- `SMTP_USER` = Your Brevo account email
- `SMTP_PASSWORD` = The SMTP Key from Brevo (starts with `xkeysib-`)
- `EMAIL_FROM` = The email address that will appear as sender
- `RECIPIENT_EMAIL` = Where contact form messages will be sent

### Step 4: Verify Sender Email (Important!)

1. In Brevo dashboard → **Senders**
2. Add `mishrilalparihar30221@gmail.com` as a sender
3. Verify it via the confirmation email Brevo sends

**Without this, emails won't send!**

### Step 5: Redeploy Backend

```bash
cd portfolio-backend
git add .
git commit -m "fix: switch to Brevo SMTP for Render compatibility"
git push origin main
```

Render will automatically redeploy.

---

## ✅ Testing

### Test 1: Backend Logs
After deployment, check Render logs for:
```
✓ Email server is ready to send messages
```

### Test 2: Contact Form
1. Go to your deployed site
2. Fill out contact form
3. Submit
4. Check:
   - Success message appears
   - Email arrives in `RECIPIENT_EMAIL` inbox
   - Auto-reply arrives in sender's inbox

---

## 📊 Brevo Free Tier Limits

- **300 emails/day** ✅ More than enough
- No credit card required
- Professional email templates
- Delivery tracking

---

## 🔧 Troubleshooting

### Issue: Still getting ETIMEDOUT
**Solution:** Verify all environment variables are set on Render (not just locally)

### Issue: Authentication failed (535)
**Solution:** 
- Verify `SMTP_PASSWORD` is the SMTP Key (not account password)
- Check for extra spaces in environment variables

### Issue: Emails not arriving
**Solution:**
- Verify sender email in Brevo dashboard
- Check spam folder
- Verify `RECIPIENT_EMAIL` is correct

### Issue: Rate limit errors
**Solution:** You're sending too many test emails. Wait a few minutes.

---

## 🎯 Production Checklist

- [ ] Brevo account created and verified
- [ ] SMTP credentials obtained from Brevo
- [ ] Sender email verified in Brevo
- [ ] All environment variables added to Render
- [ ] Backend redeployed successfully
- [ ] Test email sent successfully
- [ ] Check spam folder cleared

---

## 🔒 Security Notes

- Never commit `.env` file to Git
- Rotate SMTP keys if exposed
- Use different keys for development/production
- Monitor Brevo usage in dashboard

---

## 📚 Alternative SMTP Providers (if needed)

If Brevo doesn't work for any reason:

1. **SendGrid** - 100 emails/day free
   - Host: `smtp.sendgrid.net`
   - Port: `587`

2. **Mailgun** - 5,000 emails/month free (credit card required)
   - Host: `smtp.mailgun.org`
   - Port: `587`

3. **Amazon SES** - 62,000 emails/month free (AWS account required)
   - Host: `email-smtp.region.amazonaws.com`
   - Port: `587`

---

## 💡 Code Changes Made

### What Changed
- ✅ Replaced `service: 'gmail'` with `host: 'smtp-relay.brevo.com'`
- ✅ Added connection timeout settings
- ✅ Removed startup verification (prevents deployment failures)
- ✅ Improved error handling for SMTP errors
- ✅ Updated environment variables

### What Stayed the Same
- ✅ API routes unchanged
- ✅ Request/response format unchanged
- ✅ Email templates unchanged
- ✅ Joi validation unchanged

---

## 🎉 Success!

Once completed, your contact form will work perfectly on Render with professional, reliable email delivery through Brevo.

**Questions?** Check Render logs for detailed error messages.
