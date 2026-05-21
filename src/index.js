import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import authroute from "./routes/AuthRoutes.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import blogroute from "./routes/BlogRoute.js";

dotenv.config();

const app = express();

// Connect to database
connectDb();

// CORS setup - Allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://full-stack-project-frontend-phi.vercel.app',
  'https://full-stack-project-frontend-phi.vercel.app',
  'https://full-stack-project-backend-lovat.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

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

// Health check route
app.get("/database", (req, res) => {
  res.json({
    status: "healthy",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Routes
app.use('/api/v1/auth', authroute);
app.use('/api/v1/blog/', blogroute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: `Route ${req.url} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
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
  });
}