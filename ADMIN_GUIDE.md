# Zentiam Admin Portal Guide

## 🔐 Accessing the Admin Portal

**URL:** `http://your-domain.com/admin/login`

**Default Password:** `zentiam2025`

⚠️ **Important:** Change the default password in `/app/frontend/src/pages/admin/Login.jsx` (line 11)

---

## 📊 Dashboard Overview

The dashboard provides real-time statistics:
- **Total Consultations** - All consultation requests with new count
- **Newsletter Subscribers** - Active subscribers
- **Chat Sessions** - AI chatbot conversations
- **Weekly Activity** - Recent activity summary

---

## 📋 Managing Consultations

**Path:** `/admin/consultations`

### Features:
- View all consultation requests
- Filter by status: All, New, Contacted, Closed
- Update status with one click
- Export to CSV

### Workflow:
1. New consultations appear with "NEW" badge
2. Click "Mark as Contacted" after reaching out
3. Click "Mark as Closed" when resolved
4. Click "Export CSV" to download all data

---

## 📧 Managing Newsletter Subscribers

**Path:** `/admin/subscribers`

### Features:
- View all active subscribers
- See subscription dates
- Export to CSV

---

## 💬 Viewing Chat Sessions

**Path:** `/admin/chats`

### Features:
- View all AI chatbot conversations
- Click any session to see full conversation
- See user information (name, email, phone)
- Track answered vs unanswered questions
- Export to CSV

### What You'll See:
- Complete message history
- User details collected during chat
- Questions that were answered
- Questions that need follow-up

---

## 📄 Document Management

**Path:** `/admin/documents`

### Features:
- Upload documents to enhance chatbot knowledge
- Supported formats: PDF, PPTX, TXT
- Max file size: 10MB

### How It Works:
1. Click upload area or drag & drop file
2. Document is automatically processed
3. Chatbot uses this content to answer questions
4. No manual indexing needed

---

## ⚙️ Settings & Configuration

**Path:** `/admin/settings`

### Email Configuration

**Step 1: Get Resend API Key**
1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Get your API key from dashboard

**Step 2: Configure in Admin**
1. Select "Resend" as provider
2. Enter your API key
3. Set "From Email" (must be verified domain)
4. Set "From Name" (e.g., "Zentiam")
5. Click "Save Email Settings"

**What Gets Automated:**
- ✅ Consultation confirmation emails
- ✅ Newsletter welcome emails
- ✅ Chatbot follow-up emails (coming soon)

### Google Sheets Integration

**Current Status:** CSV Export Available

1. Enter your Google Sheet URL
2. Click "Save Sheet URL"
3. For now, use "Export CSV" buttons on each page
4. OAuth integration coming soon for auto-sync

---

## 🎯 Common Tasks

### 1. Responding to Consultation Requests
1. Go to `/admin/consultations`
2. Click "New" filter to see unread requests
3. Contact the person via email/phone
4. Mark as "Contacted"
5. Once resolved, mark as "Closed"

### 2. Exporting Data
- Each page has "Export CSV" button
- Downloads include all visible data
- Use for:
  - Weekly reports
  - CRM import
  - Analytics
  - Backup

### 3. Monitoring Chatbot Performance
1. Go to `/admin/chats`
2. Review unanswered questions
3. Upload documents to fill knowledge gaps
4. Follow up with users who left contact info

### 4. Adding Content to Chatbot
1. Go to `/admin/documents`
2. Upload:
   - Product documentation (PDF)
   - Service guides (PDF/PPTX)
   - FAQs (TXT)
   - Case studies (PDF)
3. Chatbot automatically learns from content

---

## 🔧 Technical Details

### Backend Endpoints
- `GET /api/admin/dashboard` - Statistics
- `GET /api/contact/consultations` - All consultations
- `PATCH /api/contact/consultations/:id/status` - Update status
- `GET /api/contact/newsletter/subscribers` - Subscribers
- `GET /api/chatbot/sessions` - Chat sessions
- `POST /api/chatbot/upload` - Upload documents
- `POST /api/admin/settings/email` - Save email config
- `POST /api/admin/settings/google-sheet` - Save sheet URL

### Database Collections
- `consultations` - Contact form submissions
- `newsletter_subscribers` - Email subscribers
- `chat_sessions` - AI chatbot conversations
- `settings` - System configuration

---

## 🚀 Next Steps

### Immediate Actions:
1. ✅ Change default admin password
2. ✅ Configure Resend email (optional)
3. ✅ Upload initial documents for chatbot
4. ✅ Test email notifications

### Optional Enhancements:
- Add more admin users (requires code changes)
- Set up email templates
- Configure custom email domains
- Add advanced analytics
- Implement role-based access

---

## 📞 Support

For technical assistance or custom modifications:
- Check MongoDB for raw data: `db.consultations.find()`
- Backend logs: `/var/log/supervisor/backend.*.log`
- Frontend logs: Browser console

---

## 🔒 Security Notes

- Admin password stored in frontend (client-side)
- For production: Implement proper authentication
- Use environment variables for sensitive data
- Enable HTTPS for admin portal
- Consider implementing 2FA

---

**Built with ❤️ by Emergent**
