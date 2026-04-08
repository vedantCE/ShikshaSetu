# ShikshaSetu Backend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
SMTP_USER=yourgmail@gmail.com
SMTP_APP_PASSWORD=your_gmail_app_password
SUPPORT_RECIPIENTS=dev1@gmail.com,dev2@gmail.com,dev3@gmail.com,dev4@gmail.com
```

3. Start server:
```bash
npm run dev
```

## API Endpoints

### POST /auth/register
Register parent or teacher
```json
{
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "user_password": "password123",
  "confirm_password": "password123",
  "contact_number": "1234567890",
  "address": "123 Main St",
  "user_role": "parent"
}
```

### POST /auth/login
Login parent or teacher
```json
{
  "user_email": "john@example.com",
  "user_password": "password123"
}
```

Response includes: `user_id`, `user_role`, `user_name`, `token`

### POST /students
Add child (Parent only, requires JWT)
```json
Headers: { "Authorization": "Bearer <token>" }
Body:
{
  "student_name": "Aarav",
  "age": 8,
  "password": "123456"
}
```

### GET /students
Get all children of logged-in parent (requires JWT)
```json
Headers: { "Authorization": "Bearer <token>" }
```

### POST /students/:student_id/quiz-result
Submit disorder quiz result (Parent only, requires JWT)
```json
Headers: { "Authorization": "Bearer <token>" }
Body:
{
  "ASD": 75,
  "ADHD": 40,
  "Intellectual_Disability": 60
}
```
Highest percentage disorder updates `disorder_type` in database.

### POST /update-tracing
Store tracing stars for a single alphabet or number item.
```json
Headers: { "Authorization": "Bearer <token>" }
Body:
{
  "student_id": 12,
  "type": "alphabet",
  "item": "a",
  "stars": 3
}
```

Rules:
- Saves stars in `abctracing.a` or `number_tracing.n0`-`n9`
- Keeps the max stars only
- Progress is auto-recalculated by a database trigger

### GET /tracing-progress
Returns tracing progress for all students visible to the logged-in parent or teacher.

Optional query params:
- `includeStars=true`

### GET /students/:student_id/tracing-progress
Returns tracing progress for one student if the logged-in user is mapped to that student.

Optional query params:
- `includeStars=true`

### POST /send-help
Send help/support message to team email recipients (requires JWT).
```json
Headers: { "Authorization": "Bearer <token>" }
Body:
{
  "name": "Parent Name",
  "email": "parent@example.com",
  "message": "Need help with onboarding"
}
```

Notes:
- Uses Gmail SMTP via Nodemailer
- Sends to all recipients from SUPPORT_RECIPIENTS
- Sets reply-to as user email so team can reply directly
