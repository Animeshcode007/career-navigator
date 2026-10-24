@'
# Career Navigator — UI Specification

## Visual direction

- Clean, modern student-focused interface.
- Navy: #121E3A
- Blue: #366FEB
- Cyan: #2FB ECD (implement as #2FBECD)
- Mint: #6ADCB7
- Background: #F5F7FB
- Cards: white, with subtle borders and shadows.
- Use Inter when available, with system sans-serif fallbacks.
- Responsive sidebar on desktop and collapsible navigation on small screens.

## Public screens

- Landing page with hero, explanation, workflow, feature highlights, and calls
  to register or log in.
- Registration form.
- Login form.

## Student screens

- Dashboard with greeting, assessment status, recommendation summary,
  progress indicators, and suggested next actions.
- Profile with student and academic information.
- Assessment with progress, question types, answer selection, and validation.
- Recommendations with ranked career cards, match scores, and explanations.
- Career directory with search and category filters.
- Career detail with overview, skills, qualifications, and related resources.
- Roadmap with milestones and progress indicators.
- History with prior assessment/recommendation entries.
- Progress with completed milestones and activity summary.

## Admin screens

- Admin overview.
- Career profile management.
- Resource management.
- Aggregate analytics.
- Audit log.

## Interaction and accessibility

- Visible keyboard focus.
- Labels for form fields and buttons.
- Clear validation and error messages.
- Loading and empty states.
- Responsive layouts for mobile, tablet, and desktop.
- Never communicate match scores as guarantees.
'@ | Set-Content -Encoding utf8 docs\ui-spec.md