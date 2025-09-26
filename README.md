# Anonymous Message Board

This is the boilerplate for the Anonymous Message Board project. Instructions for completing your project can be found at https://www.freecodecamp.org/learn/information-security/information-security-projects/anonymous-message-board

## Setup Instructions

### MongoDB Atlas Configuration

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
   - Create a free account and a new cluster

2. **Get Your Connection String**
   - In your Atlas dashboard, click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (it should look like: `mongodb+srv://<username>:<password>@<cluster-url>/test?retryWrites=true&w=majority`)

3. **Update Your .env File**
   - Replace the placeholder in your `.env` file:
   ```
   DB=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/messageboard?retryWrites=true&w=majority
   ```
   
4. **Whitelist Your IP Address**
   - In Atlas, go to "Network Access"
   - Add your current IP address or use `0.0.0.0/0` for development (not recommended for production)

5. **Create a Database User**
   - In Atlas, go to "Database Access"
   - Create a new user with read/write permissions
   - Use these credentials in your connection string

### Running the Application

1. Install dependencies: `npm install`
2. Update your `.env` file with your MongoDB Atlas connection string
3. Run the application: `npm start`
4. For testing: Set `NODE_ENV=test` in your `.env` file

### Security Features Implemented

- X-Frame-Options: SAMEORIGIN (prevents loading in external iframes)
- DNS prefetching prevention
- Referrer policy: same-origin

### API Endpoints

- `POST /api/threads/{board}` - Create a new thread
- `GET /api/threads/{board}` - Get recent threads
- `DELETE /api/threads/{board}` - Delete a thread
- `PUT /api/threads/{board}` - Report a thread
- `POST /api/replies/{board}` - Create a new reply
- `GET /api/replies/{board}` - Get thread with all replies
- `DELETE /api/replies/{board}` - Delete a reply
- `PUT /api/replies/{board}` - Report a reply
