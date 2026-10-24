@'
# Career Navigator — Requirements

## Purpose

Career Navigator helps students explore career options using aptitude,
interests, academic strengths, and career-profile information.

Recommendations are decision-support suggestions, not guarantees of career
success or substitutes for personal research or professional counselling.

## Student features

1. Register, log in, log out, and manage a profile.
2. Complete an assessment covering logical, numerical, and verbal aptitude,
   interests, and academic strengths.
3. Save assessment attempts and support resuming or retaking an assessment.
4. Receive up to five ranked career recommendations with match scores
   and explanations.
5. Explore career details, required skills, learning resources, courses,
   certifications, and relevant examinations.
6. Follow a career roadmap and track progress.
7. Review assessment and recommendation history.
8. View relevant notifications.

## Admin and counsellor features

1. Manage career profiles and learning resources.
2. View aggregate, anonymized analytics.
3. Review audit records of relevant administrative actions.

## Main routes

Public:
- /
- /login
- /register

Student:
- /app/dashboard
- /app/profile
- /app/assessment
- /app/recommendations/:id
- /app/careers
- /app/careers/:slug
- /app/roadmap
- /app/history
- /app/progress

Admin:
- /admin
- /admin/careers
- /admin/resources
- /admin/analytics
- /admin/audit-logs

## Technology

- React + Vite for the frontend.
- Node.js + Express for the REST API.
- MongoDB Atlas + Mongoose for persistent data.
- Python + Flask for the ML service.
- pandas and scikit-learn for data processing and modelling.
- JWT and bcrypt for backend authentication.

## Initial acceptance criteria

- The project has a documented structure.
- The frontend starts locally.
- All agreed screen routes render.
- Navigation works.
- The assessment prototype validates answers and displays a demo result.
- The UI has loading, empty, error, and responsive states where appropriate.
- No database credentials or secrets are exposed in frontend code.

## Items to finalize before production

- Career taxonomy and source of career-profile data.
- Training dataset, labels, and evaluation protocol.
- Recommendation score combination and validation.
- Retake policy, notification delivery method, deployment target,
  and expected concurrent-user target.
'@ | Set-Content -Encoding utf8 docs\requirements.md