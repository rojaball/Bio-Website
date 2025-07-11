# Formspree Contact Form Setup

## What is Formspree?
Formspree is a free service that allows you to handle form submissions without needing a backend server. It's perfect for static websites like yours.

## Setup Steps

### 1. Create a Formspree Account
1. Go to [formspree.io](https://formspree.io)
2. Click "Sign Up" (it's free)
3. Create an account with your email

### 2. Create a New Form
1. After logging in, click "New Form"
2. Enter a name for your form (e.g., "Contact Form")
3. Enter your email address: `daskibo@gmail.com`
4. Click "Create Form"

### 3. Get Your Form Endpoint
1. After creating the form, you'll see your form endpoint URL
2. It will look like: `https://formspree.io/f/xdkoqpzv`
3. Copy this URL

### 4. Update Your Website
1. Open `assets/js/contact.js`
2. Find line 8: `const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xdkoqpzv';`
3. Replace `xdkoqpzv` with your actual form ID from step 3

### 5. Test Your Form
1. Deploy your website
2. Fill out the contact form and submit
3. Check your email (daskibo@gmail.com) for the message
4. The first submission might require email verification

## Features Included
- ✅ Rate limiting (2 messages per IP per day)
- ✅ Email validation
- ✅ Spam protection
- ✅ Mobile-friendly design
- ✅ Real-time status updates
- ✅ Your email address is hidden from users

## Formspree Free Plan Limits
- 50 submissions per month
- Email notifications included
- No setup fees
- Perfect for personal websites

## Troubleshooting
If you get errors:
1. Make sure you've replaced the form endpoint with your actual one
2. Check that your website is deployed (Formspree won't work on localhost)
3. Verify your email address in Formspree dashboard
4. Check spam folder for notifications

## Alternative: Using HTML Form Action (Simpler)
If you prefer an even simpler approach, you can update the HTML form to use Formspree directly:

```html
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    <!-- Keep existing form fields -->
    <input type="hidden" name="_replyto" value="daskibo@gmail.com">
    <input type="hidden" name="_subject" value="New Contact Form Submission">
</form>
```

This approach is simpler but won't include the rate limiting feature.
