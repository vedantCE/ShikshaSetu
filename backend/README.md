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
