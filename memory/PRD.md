# Zentiam AI Consulting Website - Product Requirements Document

## Original Problem Statement
Build a comprehensive AI consulting website for Zentiam with an intelligent chatbot assistant named "Zia" that can:
- Answer questions about services using RAG (Retrieval-Augmented Generation)
- Collect lead information naturally through conversation
- Log leads to Google Sheets for business follow-up
- Self-learn and improve over time through admin curation

## Core Features

### 1. AI Chatbot "Zia"
- **Persona**: Warm, friendly AI assistant that's part of the Zentiam team
- **Conversation Flow**: Answers questions first, collects contact info later
- **Context Awareness**: Remembers conversation history, detects user intent/sentiment
- **RAG Integration**: Uses knowledge base for accurate, company-specific answers
- **Self-Learning**: Uses admin-approved answers before generating LLM responses

### 2. Admin Portal
- **SEO Management**: Meta tags, sitemap, robots.txt
- **Email Templates**: Customize email communications
- **Form Submissions**: View and manage contact form submissions
- **Chatbot Settings**: Configure Zia's behavior
- **Google Sheets Integration**: Connect to Google Sheets for lead logging
- **Learning Dashboard**: Review feedback, approve/reject Q&A pairs, track satisfaction

### 3. Google Sheets Integration
- **Business Intelligence**: Extracts structured data from conversations:
  - Lead Name, Email, Phone
  - Query Type (Pricing, Demo, Consultation, etc.)
  - Services Interested
  - Industry Detection
  - Key Requirements
  - Lead Status & Follow-up Priority
  - Conversation Summary
- **Auto-Sync**: Logs qualified leads automatically

### 4. Self-Learning Mechanism
- **Feedback Collection**: Thumbs up/down on bot responses
- **Learning Queue**: Negative feedback items queued for admin review
- **Approved Answers**: Admin can create curated Q&A pairs
- **Priority Usage**: Bot checks approved answers BEFORE generating LLM responses
- **Usage Tracking**: Tracks how often each approved answer is used

## Tech Stack
- **Frontend**: React, Tailwind CSS, Shadcn/UI
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **AI**: OpenAI GPT-4o via Emergent LLM Key
- **Integrations**: Google Sheets API

## What's Been Implemented

### Phase 1: Core Chatbot (Completed)
- [x] Chatbot widget with persona "Zia"
- [x] RAG-based knowledge retrieval
- [x] Context-aware conversation flow
- [x] Lead info collection (name, email, phone)
- [x] Feedback buttons (thumbs up/down)
- [x] Markdown rendering in chat

### Phase 2: Google Sheets Integration (Completed - Jan 21, 2026)
- [x] Service account authentication
- [x] Admin configuration page
- [x] Business intelligence extraction
- [x] Auto-sync with structured data columns
- [x] Connection status monitoring

### Phase 3: Self-Learning Mechanism (Completed - Jan 21, 2026)
- [x] Feedback collection and storage
- [x] Learning dashboard with metrics
- [x] Approved answers CRUD
- [x] Bot checks approved answers before LLM
- [x] Usage count tracking
- [x] Learning queue for negative feedback

## API Endpoints

### Chatbot
- `POST /api/chatbot/session` - Create new chat session
- `POST /api/chatbot/chat` - Send message, get response
- `POST /api/chatbot/feedback` - Submit feedback

### Admin - Google Sheets
- `GET /api/admin/sheets/status` - Get integration status
- `POST /api/admin/sheets/configure` - Configure credentials
- `POST /api/admin/sheets/sync` - Manual sync
- `GET /api/admin/sheets/recent-logs` - View recent entries

### Admin - Learning
- `GET /api/admin/learning-metrics` - Dashboard metrics
- `GET /api/admin/learning-queue` - Items pending review
- `POST /api/admin/learning-queue/{id}/approve` - Approve item
- `POST /api/admin/learning-queue/{id}/dismiss` - Dismiss item
- `GET /api/admin/approved-answers` - List approved answers
- `POST /api/admin/approved-answers` - Create approved answer
- `DELETE /api/admin/approved-answers/{id}` - Delete approved answer

## Database Collections
- `chat_sessions`: Stores conversation history
- `feedback`: User feedback on bot responses
- `learning_queue`: Items queued for admin review
- `approved_answers`: Curated Q&A pairs
- `settings`: Configuration (Google Sheets, etc.)

## Key Files
- `/app/backend/chatbot/enhanced_ai_service.py` - Core AI logic with self-learning
- `/app/backend/chatbot/google_sheets_service.py` - Google Sheets integration
- `/app/backend/feedback_routes.py` - Feedback & learning API
- `/app/frontend/src/components/ChatWidget.jsx` - Chat UI
- `/app/frontend/src/pages/admin/LearningDashboard.jsx` - Learning admin page

## Credentials
- Admin credentials: `/app/ADMIN_CREDENTIALS.md`
- Google service account: `zentiam-sheets-bot@zentiam-chatbot.iam.gserviceaccount.com`

## Next Steps / Backlog
- [ ] A/B testing for approved answers
- [ ] Sentiment trend analysis
- [ ] Email notifications for hot leads
- [ ] Chat export functionality
- [ ] Multi-language support
