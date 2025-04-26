// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// import path from "path";

// import { connectDB } from "./lib/db.js";

// import authRoutes from "./routes/auth.route.js";
// import messageRoutes from "./routes/message.route.js";
// import { app, server } from "./lib/socket.js";

// dotenv.config();

// const PORT = process.env.PORT;
// const __dirname = path.resolve();

// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
//   });
// }

// server.listen(PORT, () => {
//   console.log("server is running on PORT:" + PORT);
//   connectDB();
// });



import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Database and Socket
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

// Routes
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

// Configurations
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5001;
const isDev = process.env.NODE_ENV === "development";

// 🌈 Development-Specific Configurations
const devOrigins = [
  "http://localhost:5173",  // Vite default
  "http://127.0.0.1:5173",
  "http://localhost:3000",  // Create-react-app default
];

// 🚀 Production Origins
const prodOrigins = [
  process.env.FRONTEND_URL,
  "https://chat-app-1sc5.vercel.app",
].filter(Boolean);

// ✅ Dynamic CORS Configuration
const allowedOrigins = isDev ? [...devOrigins, ...prodOrigins] : prodOrigins;

console.log(`🌍 ${isDev ? "Development" : "Production"} Mode Activated`);
console.log("🔄 Allowed Origins:", allowedOrigins);

// 🔥 Middleware Stack
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// 🛡️ Enhanced CORS with Development Flexibility
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, etc)
      if (!origin && isDev) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`🚨 CORS Blocked: ${origin || "No origin"}`);
        callback(isDev ? null : new Error("Not allowed by CORS"), isDev);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);

// ✈️ Preflight Handling
app.options("*", cors());

// 🚦 Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// 📦 Static Files (Only in Production)
if (!isDev) {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
} else {
  // 🛠️ Development-only routes
  app.get("/api/dev", (req, res) => {
    res.json({
      status: "Development Mode",
      message: "CORS is more permissive in development",
      allowedOrigins
    });
  });
}

// 💣 Error Handling
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({
    error: isDev ? err.message : "Something went wrong!",
    stack: isDev ? err.stack : undefined
  });
});

// 🏁 Server Start
server.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`🔵 Mode: ${isDev ? "DEVELOPMENT" : "PRODUCTION"}`);
  console.log(`🌐 Allowed origins:\n${allowedOrigins.map(o => `  - ${o}`).join("\n")}`);
  connectDB().then(() => console.log("🟢 Database connected\n"));
});

// 🚨 Crash Protection
process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
  if (isDev) {
    console.warn("⚠️  Not exiting in development mode");
  } else {
    server.close(() => process.exit(1));
  }
});




// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import path from "path";

// import { connectDB } from "./lib/db.js";
// import authRoutes from "./routes/auth.route.js";
// import messageRoutes from "./routes/message.route.js";
// import { app as socketApp, server } from "./lib/socket.js"; // rename app to socketApp to avoid confusion

// dotenv.config();

// const app = express(); // create your own express app separately
// const PORT = process.env.PORT || 5000;
// const __dirname = path.resolve();

// // Middlewares
// app.use(express.json());
// app.use(cookieParser());

// // CORS settings (production + development)
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://chatapp-eight-livid.vercel.app/" // <-- change this after deploy
// ];

// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );

// // API Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// // Serve frontend build files
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "./frontend/dist")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "./frontend/dist/index.html"));
//   });
// } else {
//   app.get("/", (req, res) => {
//     res.send("API is running...");
//   });
// }

// // Start server
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   connectDB();
// });




// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

// // Database and Socket
// import { connectDB } from "./lib/db.js";
// import { app, server } from "./lib/socket.js";

// // Routes
// import authRoutes from "./routes/auth.route.js";
// import messageRoutes from "./routes/message.route.js";

// // Configurations
// dotenv.config();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const PORT = process.env.PORT || 5001;
// const isDev = process.env.NODE_ENV === "development";

// // CORS Configuration (Allowing all origins)
// const allowedOrigins = ['*'];  // Allow all origins

// console.log(`🌍 ${isDev ? "Development" : "Production"} Mode Activated`);
// console.log("🔄 Allowed Origins:", allowedOrigins);

// // Middleware Stack
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use(cookieParser());

// // CORS with "*" (Allow all origins)
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (mobile apps, curl, etc)
//       if (!origin && isDev) return callback(null, true);
      
//       if (allowedOrigins.includes('*')) {
//         callback(null, true);
//       } else {
//         console.warn(`🚨 CORS Blocked: ${origin || "No origin"}`);
//         callback(isDev ? null : new Error("Not allowed by CORS"), isDev);
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
//   })
// );

// // Preflight Handling
// app.options("*", cors());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

// // Static Files (Only in Production)
// if (!isDev) {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
//   });
// } else {
//   app.get("/api/dev", (req, res) => {
//     res.json({
//       status: "Development Mode",
//       message: "CORS is more permissive in development",
//       allowedOrigins
//     });
//   });
// }

// // Error Handling
// app.use((err, req, res, next) => {
//   console.error("🔥 Error:", err.stack);
//   res.status(500).json({
//     error: isDev ? err.message : "Something went wrong!",
//     stack: isDev ? err.stack : undefined
//   });
// });

// // Server Start
// server.listen(PORT, () => {
//   console.log(`\n🚀 Server running on port ${PORT}`);
//   console.log(`🔵 Mode: ${isDev ? "DEVELOPMENT" : "PRODUCTION"}`);
//   console.log(`🌐 Allowed origins:\n${allowedOrigins.map(o => `  - ${o}`).join("\n")}`);
//   connectDB().then(() => console.log("🟢 Database connected\n"));
// });

// // Crash Protection
// process.on("unhandledRejection", (err) => {
//   console.error("💥 Unhandled Rejection:", err);
//   if (isDev) {
//     console.warn("⚠️  Not exiting in development mode");
//   } else {
//     server.close(() => process.exit(1));
//   }
// });
