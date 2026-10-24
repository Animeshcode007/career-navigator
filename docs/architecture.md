@'
# Career Navigator — Architecture

## Components

### Frontend
React + Vite. Presents the public pages, student dashboard, assessments,
recommendations, roadmaps, progress views, and administrative screens.

### Backend API
Node.js + Express. Owns authentication, authorization, input validation,
business rules, persistence, and communication with the ML service.

### Database
MongoDB Atlas, accessed only from the backend through Mongoose.

Planned collections:
- users
- assessmentAttempts
- careerProfiles
- roadmaps
- resources
- recommendationHistory
- notifications
- auditLogs

### ML service
Python + Flask. Accepts validated assessment features and returns ranked
career recommendations with explanations and model metadata.

## Request flow

Browser
  -> React frontend
  -> Express REST API
  -> MongoDB Atlas

The Express API may call the Flask ML service when recommendations are
requested. The browser must never connect directly to MongoDB Atlas or
receive database credentials.

## Planned API groups

- /api/auth
- /api/users/me
- /api/assessments
- /api/recommendations
- /api/careers
- /api/roadmaps
- /api/history
- /api/notifications
- /api/admin

## Security principles

- Store secrets in environment variables, never source code.
- Hash passwords using bcrypt on the backend.
- Validate all incoming data.
- Enforce role-based authorization on the backend.
- Use HTTPS in production.
- Avoid exposing identifiable student data in aggregate analytics.

## ML approach

Explore content-based similarity (such as cosine similarity) and a supervised
classifier (such as Random Forest or Decision Tree). The final ranking method
must be documented and evaluated against a held-out dataset before claiming
performance. No model accuracy is assumed at this stage.
'@ | Set-Content -Encoding utf8 docs\architecture.md