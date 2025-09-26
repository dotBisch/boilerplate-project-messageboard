# Anonymous Message Board - Production Deployment Guide

## 🚀 Production Setup

### Environment Variables
Create a `.env` file with the following variables:

```env
NODE_ENV=production
PORT=3000
DB=mongodb+srv://username:password@your-cluster.mongodb.net/database-name?retryWrites=true&w=majority
```

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your server's IP address
5. Get your connection string

### Security Features
✅ X-Frame-Options: SAMEORIGIN  
✅ DNS prefetching prevention  
✅ Referrer policy: same-origin  
✅ No sensitive data in logs  
✅ Environment variables properly secured  

### Deployment Commands

**Production:**
```bash
npm start
```

**Development:**
```bash
npm run dev
```

**Testing:**
```bash
npm run test
```

### API Endpoints

**Threads:**
- `POST /api/threads/{board}` - Create new thread
- `GET /api/threads/{board}` - Get recent threads  
- `DELETE /api/threads/{board}` - Delete thread
- `PUT /api/threads/{board}` - Report thread

**Replies:**
- `POST /api/replies/{board}` - Create new reply
- `GET /api/replies/{board}` - Get thread with replies
- `DELETE /api/replies/{board}` - Delete reply  
- `PUT /api/replies/{board}` - Report reply

### Production Considerations

1. **Database Connection:** Uses MongoDB Atlas with proper error handling
2. **Logging:** Minimal logging in production, detailed in development
3. **Error Handling:** Generic error messages to prevent information leakage
4. **Environment:** Proper NODE_ENV handling for production vs test modes
5. **Security:** All required security headers implemented

### Testing
All 10 functional tests pass:
- Thread creation, viewing, deletion, reporting
- Reply creation, viewing, deletion, reporting  
- Proper password validation and error handling

Ready for deployment! 🎯