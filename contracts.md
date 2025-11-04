# Zentiam AI Consulting Website - Backend Integration Contracts

## Current State
Frontend is fully functional with mock data from `/app/frontend/src/mock.js`. All pages are working:
- Home page with hero, stats, services preview, testimonials
- About page with mission, values, team info
- Services page with detailed service cards
- Products page with Zentiam Labs products
- Contact page with consultation form and newsletter signup

## Mock Data Structure (mock.js)

### Services
```javascript
mockServices = [
  { id, title, description, icon, color, details }
]
```

### Products
```javascript
mockProducts = [
  { id, title, description, features: [], status }
]
```

### Testimonials
```javascript
mockTestimonials = [
  { id, name, role, quote, company }
]
```

### Stats, FAQs, Blog Posts
- Currently static, no backend needed for MVP

## Backend APIs to Implement

### 1. Contact Form Submission
**Endpoint:** `POST /api/contact/consultation`
**Purpose:** Handle consultation booking form submissions
**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "company": "string (optional)",
  "phone": "string (optional)",
  "service": "string (required) - consultation|custom-solution|automation|training|products",
  "message": "string (required)"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Thank you! We'll get back to you within 24 hours.",
  "submissionId": "uuid"
}
```
**Database Model:** `consultations` collection
- Store all form submissions
- Add timestamp, status (new/contacted/closed)
- Email notification to admin (optional for MVP)

### 2. Newsletter Subscription
**Endpoint:** `POST /api/newsletter/subscribe`
**Purpose:** Handle newsletter email subscriptions
**Request Body:**
```json
{
  "email": "string (required)"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Thanks for subscribing!"
}
```
**Database Model:** `newsletter_subscribers` collection
- Store email, subscribed_date, status (active/unsubscribed)
- Prevent duplicate emails

### 3. Product Demo Request (Optional Enhancement)
**Endpoint:** `POST /api/products/demo-request`
**Purpose:** Handle product demo requests
**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "company": "string",
  "productId": "number",
  "message": "string"
}
```

## Frontend Integration Changes

### Contact Page (Contact.jsx)
**Replace:**
```javascript
console.log('Form submitted:', formData);
```
**With:**
```javascript
const response = await axios.post(`${API}/contact/consultation`, formData);
```

**Replace:**
```javascript
console.log('Newsletter signup:', newsletter);
```
**With:**
```javascript
const response = await axios.post(`${API}/newsletter/subscribe`, { email: newsletter });
```

### Products Page (Products.jsx)
**Replace:**
```javascript
onClick={() => alert('Product demo request - will be connected to backend')}
```
**With:**
```javascript
onClick={() => handleDemoRequest(product.id)}
```

## Backend Implementation Steps

1. **Create MongoDB Models**
   - Consultation model (name, email, company, phone, service, message, status, created_at)
   - Newsletter model (email, subscribed_date, status)

2. **Create API Routes**
   - `/api/contact/consultation` - POST route for form submissions
   - `/api/newsletter/subscribe` - POST route for newsletter signups
   - Add validation using Pydantic models

3. **Add Email Notifications (Optional for MVP)**
   - Send confirmation email to user
   - Send notification to admin team

4. **Error Handling**
   - Validate email formats
   - Handle duplicate newsletter subscriptions
   - Return appropriate error messages

## Frontend Files to Update
1. `/app/frontend/src/pages/Contact.jsx` - Add axios API calls
2. `/app/frontend/src/pages/Products.jsx` - Add demo request functionality (optional)

## Backend Files to Create
1. `/app/backend/models.py` - Add Consultation and Newsletter models
2. `/app/backend/server.py` - Add new API routes
3. `/app/backend/utils/email.py` (optional) - Email notification utilities

## Testing Checklist
- [ ] Contact form submission stores in database
- [ ] Newsletter signup stores in database
- [ ] Duplicate email prevention for newsletter
- [ ] Form validation works correctly
- [ ] Success/error messages display properly
- [ ] Email notifications work (if implemented)

## Notes
- All other content (services, products, testimonials) will remain static for MVP
- No authentication needed for MVP
- Admin panel for managing submissions is out of scope for MVP
- Email integration can be added later if needed
