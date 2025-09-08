
# Koku-Messenger 

Koku-Messenger is a full-stack real-time chat application designed for modern messaging needs. It combines robust backend technologies with a clean and responsive frontend interface to deliver seamless communication between users.


## 🚀 Features

- 🔐 **Authentication & Session Management**
  - Secure **username-based login** using **JWT (JSON Web Tokens)**
  - Session handling with **cookie-parser**
  - 🔐 **Single Session Login (One Device at a Time)**
    - Users can only stay logged in on **one device at a time**
    - Logging in from a new device will **automatically log out** the previous session
  - 🔐 **Logout Options**
    - Logout from the current device only

- 💬 **Real-Time Messaging**
  - Instant messaging with **Socket.io**
  - Smooth, responsive chat interface using **HTML, CSS, JavaScript**, and **Bootstrap**

- ✍️ **Typing Indicators**
  - See when other users are typing in real time

- 🟢 **User Presence**
  - Online/offline status tracking
  - Real-time user list updates via sockets

- 🧾 **Message History**
  - Messages stored and retrieved from **MongoDB Atlas**
  - Users can **delete their own messages**

- 📱 **Responsive UI**
  - Fully responsive design with **Bootstrap**
  - Optimized for mobile and desktop

- 🧑 **User Profiles**
  - Upload and display profile pictures using **AWS S3**
  - If no picture is uploaded, user initials are shown with a gradient background

- 🌙 **Dark/Light Mode Toggle**
  - Switch between dark and light themes

- 💾 **MongoDB Atlas**
  - Cloud-based NoSQL database for message and user data

- ☁️ **AWS S3**
  - Secure, scalable storage for profile images



## 🛠️ Tech Stack

### Frontend
- HTML, CSS, JavaScript
- Bootstrap (responsive UI).
- js-cookie (for handling cookies on client side)

### Backend
- Node.js (JavaScript runtime)
- Express.js (web framework)
- Socket.IO (Real-time bi-directional communication)
- bcrypt (password hashing)
- jsonwebtoken (JWT authentication)
- cookie-parser (parsing cookies)
- cors (enabling CORS)
- dotenv (environment variable management)
- express-validator (input validation)
- multer (file upload handling)

### Database
- MongoDB Atlas (cloud-hosted NoSQL database)
- Mongoose (MongoDB ODM for schema and querying)

### Real-Time Communication
- Socket.IO — Core library for real-time, event-based communication enabling live chat.

### Cloud & Storage
- AWS S3 SDK (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`) for secure media upload/storage

## 🚀 Getting Started / Installation

Follow these steps to run the project locally.

### 📦 Prerequisites 
- Node.js installed  
- MongoDB installed (or access to MongoDB Atlas)  
- AWS account with an S3 bucket created  
- Git installed

### 🔧 Installation
```bash
1. **Clone the repository**
   git clone https://github.com/Prawin-736/koku-Messenger.git

2. **Install backend dependencies**
cd server
npm install

3. **Set up environment variables**

## 🔧 Environment Variables

Create a `.env` file in the `server/` directory with the following content:

# ---------------- MongoDB ----------------
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<your_db_name>
DB_NAME=<your_database_name>

# ---------------- JWT ----------------
JWT_SECRETKEY=<your_jwt_secret_key>

# ---------------- AWS ----------------
AWS_BUCKET_NAME=<your_aws_bucket_name>
AWS_REGION=ap-south-1
AWS_ACCESS_KEY=<your_aws_access_key>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>


4. **Start the backend server**
node server.js


## 📂 Project Structure (Simplified)

Koku App-project
├── client               # Frontend application
│   └── src
│       ├── assets       # Static assets like icons
│       │   └── icon
│       ├── main         # HTML, CSS, frontend JS, and socket.config.js for the main page
│       └── user         # HTML, CSS, and frontend JS for user section pages
└── server               # Backend of the application
    ├── aws              # AWS-related utilities
    ├── src
    │   ├── features     # Core business logic
    │   │   ├── message  # Message handling - includes controller, repository, router, and schema
    │   │   └── user     # User management - includes controller, repository, router, and schema
    │   └── middleware   # User validation, token expiration check, error handling, JWT verification
    └── server.js        # Root server file


## 🌍 Deployment

- Platform: AWS EC2  
- Backend: Running on Node.js with PM2  
- Frontend: Served with Nginx  
- Live Demo: http://<your-ec2-ip-or-domain>


## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## 👤 Author

**PRAWIN KUMAR S**
- GitHub: [@Prawin-736](https://github.com/Prawin-736)
- LinkedIn: [Prawin Kumar S](https://www.linkedin.com/in/prawin-kumar-s/)



