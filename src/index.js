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

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend.vercel.app', //  frontend URL 
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/api", (req, res) => {
  res.json({
    message: "Flower API is running!",
    status: "success"
  });
});

// Routes
app.use('/api/v1/auth', authroute);
app.use('/api/v1/blog/', blogroute);

// For Vercel serverless
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
}