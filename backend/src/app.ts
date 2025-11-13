import express, { Request, Response, NextFunction, urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import routes from "./routes";
import cookieParser from "cookie-parser";
import multer from "multer";

export const app = express();

// Add  CORS
var whitelist = [
  "https://perfect-light-production-ae50.up.railway.app",
  "http://localhost:5173",
  "http://localhost:3000",
];
var corsOptions = {
  origin: function (
    origin: any,
    callback: (err: Error | null, origin?: any) => void
  ) {
    // this is for mobile and
    if (!origin) {
      return callback(null, true);
    }
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app
  .use(morgan("dev"))
  .use(urlencoded({ extended: true }))
  .use(express.json())
  .use(cors(corsOptions))
  .use(helmet())
  .use(cookieParser())
  .use(compression());

app.use(express.static("upload/images"));

app.use(routes);

// if there is an error these codes will be executed (means don't stop the server will still run)
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  // console.error("🔥 ERROR:", error?.stack || error);

  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: error.message, code: error.code });
  }
  const errorStatus = error.status || 500;
  const errorMsg = error.message || "Internal Server Error!";
  const errorCode = error.code || "Error_Server";
  res.status(errorStatus).json({
    message: errorMsg,
    error: errorCode,
  });
  next();
});
