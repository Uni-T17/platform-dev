import express, { Request, Response, NextFunction, urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import routes from "./routes";

export const app = express();

const corsOptions = {};

app
  .use(morgan("dev"))
  .use(urlencoded({ extended: true }))
  .use(express.json())
  // .use(cors(corsOptions))
  .use(helmet())
  .use(compression());

app.use(routes);

// if there is an error these codes will be executed (means don't stop the server will still run)
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const errorStatus = error.status || 500;
  const errorMsg = error.message || "Internal Server Error!";
  const errorCode = error.code || "Error_Server";
  res.status(errorStatus).json({
    message: errorMsg,
    error: errorCode,
  });
  next();
});
