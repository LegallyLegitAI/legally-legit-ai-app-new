# How to Implement Your Email Sequence

This guide provides instructions for implementing the 7-day email sequence in your email marketing platform (e.g., Mailchimp, ConvertKit, SendGrid, etc.).

**Key Considerations:**

- **Inline CSS:** All styling is done with inline CSS for maximum compatibility with email clients. **Do not** attempt to move styles to a separate stylesheet.
- **Responsiveness:** The emails are designed to be responsive and should look great on both desktop and mobile devices.
- **Images:** For best results, upload your logo and any other images to your email marketing platform's file manager and use their generated URLs.
- **Dark Mode:** The emails are designed to be compatible with dark mode, but always test them in various clients (like Gmail, Outlook, and Apple Mail) to ensure they render correctly.
- **Testing:** Before sending any email to your list, send a test email to yourself and view it on different devices and in different email clients.

## Step-by-Step Implementation Guide

1.  **Log in to Your Email Marketing Platform:**
    -   Access your email marketing platform (e.g., Mailchimp, ConvertKit, etc.).
    -   Navigate to the section where you create new email campaigns or automations.

2.  **Create a New Email/Template:**
    -   Most platforms have an option to create a new email template or a new campaign from scratch.
    -   Choose the option to **"Code your own"** or **"Import HTML"**. **Do not** use a drag-and-drop editor, as this may override the custom HTML.

3.  **Copy and Paste the HTML:**
    -   Open the corresponding HTML file for each day of the sequence (e.g., `day1.html`).
    -   Select all the content of the file (`Ctrl+A` or `Cmd+A`) and copy it (`Ctrl+C` or `Cmd+C`).
    -   Paste the HTML code directly into the code editor of your email marketing platform.

4.  **Update Placeholders:**
    -   **Subject Line & Pre-header:** Copy the subject line and pre-header from the corresponding `.md` file or the `<title>` and hidden `<div>` in the HTML file and paste them into the appropriate fields in your email platform's campaign settings.
    -   **[Name] Personalization:** Replace `[Name]` with your email platform's personalization tag for the recipient's first name (e.g., `*|FNAME|*` in Mailchimp, `{{ subscriber.first_name }}` in ConvertKit).
    -   **CTA Button Links:** Replace `https://your-app-url.com/...` with the actual URLs to your application.
    -   **{$unsubscribe} Tag:** Replace `{$unsubscribe}` with your email platform's unsubscribe tag.
    -   **Company Address:** Update the footer with your correct company information.

5.  **Set Up the Automation/Sequence:**
    -   Create a new automation or sequence in your email marketing platform.
    -   Set the trigger for the sequence to be when a user signs up for your free trial or mailing list.
    -   Create 7 emails in the sequence, one for each day.
    -   For each email, set the delay (e.g., "Wait 1 day") before sending.

6.  **Test, Test, Test:**
    -   Before activating the sequence, send a test email for each day to yourself and your team.
    -   Check the following:
        -   Subject line and pre-header are correct.
        -   Personalization is working.
        -   Links are correct and not broken.
        -   The email looks good on desktop (Gmail, Outlook) and mobile (iOS, Android).

7.  **Activate the Sequence:**
    -   Once you're happy with how everything looks and works, activate the email sequence.

**Example: Mailchimp Implementation**

1.  Go to **Campaigns > Email Templates > Create Template**.
2.  Select the **Code your own** tab.
3.  Paste the HTML from the file.
4.  Save the template.
5.  Go to **Automations** to create your 7-day sequence and select your saved templates for each day.

By following these instructions, you'll have a professional, high-converting email sequence ready to nurture your new users and turn them into paying customers.
