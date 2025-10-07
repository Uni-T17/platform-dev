import express, { urlencoded } from "express";
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
  .use(cors(corsOptions))
  .use(helmet())
  .use(compression());

app.use("/v1", routes);
