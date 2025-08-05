# Email Customization Quick Reference

This guide helps you customize key elements of your email templates for your specific business needs.

## Key Elements to Customize

### 1. Company Branding
- **Company Name:** Change "Legally Legit AI" to your company name in the header `<h1>` tag
- **Logo:** Replace the text-based header with your logo image if desired
- **Company Address:** Update the footer with your actual business address

### 2. Links to Update
Replace all placeholder URLs with your actual application URLs:

- `https://your-app-url.com/free-trial` → Your free trial signup page
- `https://your-app-url.com/employment-contracts` → Employment contract generation page
- `https://your-app-url.com/privacy-policy` → Privacy policy generation page
- `https://your-app-url.com/terms-conditions` → Terms & conditions generation page
- `https://your-app-url.com/service-agreements` → Service agreement generation page
- `https://your-app-url.com/success-stories` → Customer testimonials/case studies page
- `https://your-app-url.com/activate-now` → Final conversion/payment page

### 3. Personalization Tags
Replace `[Name]` with your email platform's personalization tag:

- **Mailchimp:** `*|FNAME|*`
- **ConvertKit:** `{{ subscriber.first_name }}`
- **SendGrid:** `{{first_name}}`
- **ActiveCampaign:** `%FIRSTNAME%`

### 4. Color Scheme
Each email uses different colors to create visual variety. You can modify these by changing the hex color codes:

**Day 1 (Welcome):** Blue theme (`#2563eb`)
**Day 2 (Fair Work):** Red theme (`#dc2626`) 
**Day 3 (Data Privacy):** Green theme (`#059669`)
**Day 4 (T&Cs):** Brown theme (`#7c2d12`)
**Day 5 (Contracts):** Green theme (`#059669`)
**Day 6 (Social Proof):** Blue theme (`#2563eb`)
**Day 7 (Last Chance):** Red urgency theme (`#dc2626`)

### 5. Subject Lines & Pre-headers
Copy these from the HTML files or the markdown files:

**Day 1:**
- Subject: "Welcome to Legally Legit AI - Your Business Guardian"
- Pre-header: "Start protecting your Australian business from costly legal mistakes today"

**Day 2:**
- Subject: "The $12k mistake most Aussie businesses make"
- Pre-header: "Are you accidentally breaking this critical Fair Work law? Let's check."

**Day 3:**
- Subject: "A data breach could kill your business. Seriously."
- Pre-header: "Is your Privacy Policy compliant with Australian law? Fines are steep."

**Day 4:**
- Subject: "Your website T&Cs might be worthless..."
- Pre-header: "Avoid costly disputes and protect your business with legally sound T&Cs."

**Day 5:**
- Subject: "Stop chasing unpaid invoices. Fix this instead."
- Pre-header: "Bulletproof contracts ensure cash flow - weak ones kill businesses."

**Day 6:**
- Subject: "Don't just take our word for it..."
- Pre-header: "See how Legally Legit AI is protecting Aussie businesses just like yours."

**Day 7:**
- Subject: "FINAL NOTICE: Your trial expires in 24 hours"
- Pre-header: "Don't leave your business exposed. This is your last chance to get protected."

### 6. Testimonials (Day 6)
Replace the example testimonials with real customer feedback:

```html
<div style="background-color: #f8f9fa; border: 1px solid #eaeaef; padding: 20px; margin: 20px 0; border-radius: 8px;">
    <p style="margin-top: 0; font-style: italic;">"Your customer's testimonial here"</p>
    <p style="font-weight: 600; text-align: right; margin-bottom: 0;">- Customer Name, Business Type</p>
</div>
```

### 7. Pricing (Day 7)
Update the pricing mentioned in the final email ($97/month) with your actual pricing.

## Making Visual Changes

### Button Styling
To change button colors, modify the `background-color` property:
```html
<a href="..." style="background-color: #YOUR_COLOR; color: #ffffff; ...">
```

### Text Colors
To emphasize different sections, you can change text colors:
```html
<p style="color: #YOUR_COLOR; font-weight: 600;">Important text</p>
```

### Background Colors for Sections
Alert boxes and highlighted sections use background colors:
```html
<div style="background-color: #YOUR_BACKGROUND_COLOR; padding: 20px; border-radius: 6px;">
```

## Testing Checklist

After making changes, test each email for:
- [ ] All links work correctly
- [ ] Personalization displays properly
- [ ] Colors look good on desktop and mobile
- [ ] Text is readable in both light and dark modes
- [ ] Unsubscribe link works
- [ ] Email renders correctly in Gmail, Outlook, and Apple Mail

Remember: Always send test emails before activating your sequence!
