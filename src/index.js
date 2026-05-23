import dns from 'dns'
dns.setServers(['8.8.8.8','1.1.1.1'])
import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import authroute from "./routes/AuthRoutes.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import blogroute from "./routes/BlogRoute.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

// Connect to database
connectDb();

// CORS setup - Allow all for now (temporary fix)
app.use(cors({
  origin: ['https://full-stack-project-frontend-phi.vercel.app','http://localhost:5173'], // Allow all origins temporarily
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Origin', 'X-Requested-With', 'Accept']
}));

// Handle preflight requests
// app.options('/', cors());

app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Flower API is running!",
    status: "success",
    time: new Date().toISOString()
  });
});

// Health check route (fixed)
app.get("/database", (req, res) => {
  res.json({
    status: "healthy",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    time: new Date().toISOString()
  });
});

// Routes
app.use('/api/v1/auth', authroute);
app.use('/api/v1/blog/', blogroute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: `Route ${req.method} ${req.url} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    status: false,
    message: err.message || 'Something went wrong!'
  });
});

// For Vercel serverless
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
    console.log("MongoDB status:", mongoose.connection.readyState === 1 ? "Connected" : "Disconnected");
  });
}