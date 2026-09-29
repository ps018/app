# 📧 EmailJS Setup Guide — Receive Form Inquiries in the Doctor's Inbox

The appointment form on this website already contains the complete sending logic
(`script.js`). You only need to create a free EmailJS account, then paste **3 values**
into `script.js`. Takes ~10 minutes.

---

## Step 1 — Create a free EmailJS account

1. Go to **https://www.emailjs.com** → **Sign Up** (free plan: 200 emails/month).
2. Confirm your email address.

## Step 2 — Connect the doctor's email service (get `SERVICE_ID`)

1. In the dashboard, open **Email Services** → **Add New Service**.
2. Choose the provider the doctor's professional mailbox uses
   (Gmail, Outlook, Zoho, or "Other" for custom SMTP).
3. Connect the account and **approve access**.
4. Set **"To Email"** to the doctor's professional address (e.g. `dr@clinic.com`).
5. Copy the **Service ID** (looks like `service_xxxxxxx`).

## Step 3 — Create the email template (get `TEMPLATE_ID`)

1. Open **Email Templates** → **Create New Template**.
2. Set:
   - **To Email:** the doctor's professional address (fixed here — never from user input)
   - **Reply-To:** `{{email}}`  ← so "Reply" in the inbox reaches the patient directly
   - **Subject:** `New inquiry — {{full_name}}`
3. Paste this body (or design your own — keep the variable names):

```text
New inquiry from the website:

Name:     {{full_name}}
Phone:    {{phone}}
Email:    {{email}}
Service:  {{service}}

Message:
{{message}}
```

4. **Save** and copy the **Template ID** (looks like `template_xxxxxxx`).

> The variable names above match the form's field `name` attributes exactly
> (`full_name`, `phone`, `email`, `service`, 
> `message`). If you rename anything, rename it in
> **both** the template and the form.

## Auto-reply template (`template_3ulgtnn`)

Sends a confirmation email to the visitor after every successful inquiry.
In the EmailJS dashboard, open this template and set:
- **To Email:** `{{email}}`  ← the visitor's own address
- **Subject:** e.g. `We've received your inquiry`
- **Body:** thank `{{full_name}}` for reaching out and confirm that
  Dr. Richa Sinha will reply shortly. Keep the same variable names
  (`full_name`, `phone`, `email`, `service`, `message`).

## Step 4 — Get the `PUBLIC_KEY`

1. Open **Account** (left sidebar) → **Keys**.
2. Copy the **Public Key** (looks like `AbC123XyZ...`).
   It is safe to expose in browser code — it can only trigger your own template.

## Step 5 — Paste the 3 values into `script.js`

Open **`script.js`** and edit the config block at the very top:

```js
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "PLXf-2xvGiN-R78no",
  SERVICE_ID: "service_54gl2uu",
  TEMPLATE_ID: "template_mehiq6z",           // "Send inquiry" → doctor's inbox
  AUTOREPLY_TEMPLATE_ID: "template_3ulgtnn", // auto-reply → visitor's inbox
};
```

That's it — the form now sends live email. While the values are placeholders,
the form runs in **demo mode** (validates and shows the success state without sending).

## Step 6 — Test it

1. Open the site and submit the form with valid data.
2. Check the doctor's inbox **and spam folder**.
3. Use "Reply" on the received email — it should address the patient, not the service account.
4. Submit with an empty/invalid email to confirm validation blocks it.
5. Submit twice quickly — the built-in 10-second throttle (via EmailJS `limitRate`)
   should block the second attempt.

## Security notes

- Only the **Public Key** belongs in browser code. Never place an SMTP password or
  EmailJS **private key** in `index.html` / `script.js`.
- In the EmailJS dashboard, enable the **domain allowlist** and add your live domain
  (see DOMAIN-HOSTING-GUIDE.md) so only your site can trigger the template.
- A hidden "honeypot" field and client-side throttling are already built into the form.

## Troubleshooting

| Symptom | Fix |
|---|---|
| "Demo mode" toast appears | The 3 config values are still placeholders |
| 403 / "bad recipient" error | Service not connected, or "To Email" missing in the template |
| Email arrives with empty fields | Template variable names don't match the form `name` attributes |
| Works locally, fails on domain | Add the new domain to the EmailJS allowlist |
