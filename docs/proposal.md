# Women Over 40 Health App - Week 1 Proposal

## 1) Project Idea

Women Over 40 Health App is a mobile-first wellness tracking platform designed for women in perimenopause, menopause, and post-menopause. The application centralizes daily symptom, sleep, mood, activity, and nutrition data so users can identify trends over time and support more informed discussions with healthcare professionals.

## 2) Features

- Register and authenticate securely to access a private personal dashboard.
- Complete a daily health check-in that records symptom severity, mood, sleep quality, and energy level.
- Track menstrual and menopause-stage indicators where applicable.
- Log nutrition, hydration, and physical activity entries.
- Review weekly and monthly trend summaries across key health metrics.
- Filter visualized data by date range and metric category.
- Create and manage personal notes and medication or supplement reminders.
- Export a concise health summary (PDF or shareable format) for clinical appointments.
- Receive scheduled reminder notifications for daily check-ins.
- Configure profile and app preferences, including units, reminder times, and privacy settings.

## 3) Target Audience

The primary audience is women aged 40 and older who want a private, structured way to monitor health patterns during perimenopause, menopause, and post-menopause. The target user is typically balancing work, caregiving, and personal health responsibilities, and therefore requires a low-friction mobile experience that supports quick daily logging and clear, actionable trend visibility.

## 4) Technology Stack

| Layer | Technology |
|---|---|-
| Frontend (mobile-first) | Expo (React Native), Expo Router, TypeScript |
| Frontend (web support) | React Native Web via Expo |
| Backend API | Node.js, Express |
| Database | MongoDB Atlas |
| Data Models | Mongoose |
| Authentication | JWT (planned) |
| Notifications | Expo Notifications (planned) |
| Deployment (backend) | Render Web Service (or Railway) |
| Deployment (frontend web preview) | Expo web build / Vercel (optional) |
| Version Control | Git + GitHub (separate frontend/backend repos) |

### Scope (Week 1 planning baseline)

In scope for capstone MVP:

- Authentication
- Daily health check-ins
- Trend visualization views
- Basic reminders

Out of scope for MVP:

- Social networking features
- AI-based diagnosis or medical recommendations
- Wearable device integrations
- Telehealth booking workflows

## 5) Cost Estimate

This estimate is prepared for Week 1 planning and proposal evaluation. It is not a final procurement budget; values are directional and based on publicly available pricing pages as of May 2026.

### Free Tier (assignment / development)

| Service | Plan | Monthly Cost |
|---|---|---|-
| Backend hosting | Render Free Web Service | $0 |
| Database | MongoDB Atlas Free (M0) | $0 |
| Frontend hosting (optional web) | Vercel Hobby or Expo preview workflow | $0 |
| Push notifications | Expo basic usage | $0 |
| Domain | none | $0 |
| **Total** |  | **$0/month** |

Professional note:

- Free backend services may sleep (cold starts).
- Atlas free tier has storage and performance limits.

### Paid (basic production-ready reference)

| Service | Plan | Monthly Cost |
|---|---|---|-
| Backend hosting | Render Starter (always-on) | ~$7 |
| Database | MongoDB Atlas M10 | ~$57 |
| Monitoring/logging | Basic hosted logs/alerts | ~$10 |
| Frontend hosting | Vercel Pro (optional) | ~$20 |
| Domain | .com average annual cost / 12 | ~$1-2 |
| **Total** |  | **~$95-100/month** |

### At Scale (rough projection for growth discussion)

| Service | Scale Concern | Likely Upgrade / Impact |
|---|---|---|-
| Backend API | More concurrent requests and background jobs | Higher compute tier or horizontal scaling (~$25-80+) |
| MongoDB Atlas | Storage growth + higher query load | M20/M30 class cluster (~$130-200+) |
| Notifications | Higher volume delivery | Potential paid messaging or queue tooling (~$10-50) |
| Observability | Stronger monitoring and alerting requirements | Upgraded monitoring plans (~$20-100) |
| **Estimated total at scale** |  | **~$220-430/month** |

## Week 1 Deliverables Tracking

- [x] Proposal drafted in docs/proposal.md
- [x] Architecture file created in docs/architecture.excalidraw
- [ ] Proposal approval (pending instructor)
- [ ] Repos shared with instructor
