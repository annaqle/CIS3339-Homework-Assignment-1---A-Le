# CIS3339-Homework-Assignment-1---A-Le

Student Management System built with **Vue 3 (Composition API)**, **Vue Router**, **Pinia**, **Node.js/Express**, and **MongoDB**.

The application is in the `cis3339-homework1/` folder.

## Required Software

- [Node.js](https://nodejs.org/) (LTS version) and npm
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community) running locally on the default port `27017`
- A modern web browser

## Environment Variables

The `.env` file is included in the repository at `cis3339-homework1/.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/cis3339_homework1
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | Connection string for the local MongoDB database |

No database setup is needed. The database, collections, and indexes are created automatically when the server starts.

## Start MongoDB Community Edition

**Windows:** If MongoDB was installed as a service, it starts automatically. To start it manually, open **Services**, find **MongoDB Server**, and click **Start**, or run this in an administrator terminal:

```bash
net start MongoDB
```

**macOS (Homebrew):**

```bash
brew services start mongodb-community
```

**Linux:**

```bash
sudo systemctl start mongod
```

## Install Dependencies

```bash
cd cis3339-homework1
npm install
```

This installs the dependencies for both `backend/` and `frontend/`.

## Build the Production Frontend

```bash
npm run build
```

This builds the Vue application into `frontend/dist/`.

## Start the Server

```bash
npm start
```

## Open the Application

**http://localhost:3000**

## Project Structure

```
cis3339-homework1/
  .env                  MongoDB connection string
  package.json          install / build / start scripts
  backend/
    server.js           Express REST API and production file server
    models/             Mongoose models: Student, Course, Enrollment
  frontend/
    src/
      views/            Students, Courses, Enrollments pages (Vue Router)
      components/       StudentTable, CourseSelect, StatusMessage
      stores/           Pinia stores: students, courses
      composables/      useStatus (loading / error / success messages)
      router/           Vue Router routes
```

## API Endpoints

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/list-students` | | List all students |
| POST | `/find-student` | `{ name }` | Search for a student by name |
| POST | `/add-student` | `{ name, id, phone, zip }` | Add a student (rejects duplicate IDs) |
| POST | `/delete-student` | `{ name }` | Delete a student and their enrollments |
| GET | `/list-courses` | | List all courses |
| POST | `/add-course` | `{ courseId, courseName }` | Add a course (rejects duplicate course IDs) |
| POST | `/delete-course` | `{ courseId }` | Delete a course and its enrollments |
| POST | `/enroll-student` | `{ studentId, courseId }` | Enroll a student in a course (rejects duplicates) |
| POST | `/course-students` | `{ courseId }` | List the students enrolled in a course |

## Development Mode (optional)

To work on the frontend with hot reload, run the server and the Vue dev server in two terminals:

```bash
# Terminal 1 (in cis3339-homework1)
npm start

# Terminal 2 (in cis3339-homework1/frontend)
npm run dev
```

Then open the URL shown by Vite (usually http://localhost:5173). API requests are forwarded to the Express server on port 3000.


Used AI to help compose the README statements.