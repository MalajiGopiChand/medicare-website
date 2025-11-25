# Quick Setup Guide

## Step 1: Install Dependencies

Run this command in the root directory:
```bash
npm run install-all
```

Or manually:
```bash
npm install
cd client
npm install
cd ..
```

## Step 2: Set Up MongoDB

### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/healthcare`

### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `.env` file with your connection string

## Step 3: Create Environment File

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/healthcare
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

**Important:** Change `JWT_SECRET` to a strong random string in production!

## Step 4: Start the Application

### Development Mode (Both servers together):
```bash
npm run dev
```

### Or start separately:

**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run client
```

## Step 5: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## First Time Usage

1. Go to http://localhost:3000/register
2. Create your account
3. Login and start using the app!

## Troubleshooting

### Port 3000 already in use?
- Kill the process using port 3000 or change React port in `client/package.json`

### Port 5000 already in use?
- Change PORT in `.env` file

### MongoDB connection error?
- Make sure MongoDB is running
- Check your connection string in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Module not found errors?
- Run `npm install` in both root and client directories
- Delete `node_modules` and reinstall if needed

