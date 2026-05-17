Student Hostel Management System

Problem Statement :
Universities often manage hostel records manually, which can cause data loss, room allocation conflicts, and inefficient record handling.

This project provides a RESTful API solution to manage hostel student information efficiently using Node.js, Express.js, MongoDB, and JWT Authentication.

Features
- Admin Registration and Login
- JWT Authentication
- Add Student
- View All Students
- Update Student Details
- Delete Student Records
- Protected API Routes

Technologies Used
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- React.js
- Postman
- GitHub

API Endpoints

Authentication
| Method |      Endpoint      |   Description  |
|--------|--------------------|----------------|
| POST   | /api/auth/register | Register Admin |
| POST   | /api/auth/login    | Admin Login    |

### Students
| Method |         Endpoint         |    Description   |
|--------|--------------------------|------------------|
| POST   | /api/students/create     | Add Student      |
| GET    | /api/students/getAll     | Get All Students |
| PUT    | /api/students/update/:id | Update Student   |
| DELETE | /api/students/delete/:id | Delete Student   |

## Setup Instructions

### Clone Repository
```bash
git clone https://github.com/yourusername/student-hostel-management-system.git
