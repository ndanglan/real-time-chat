import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import methodOverride from "method-override";
import session from "express-session";
import config from "config";
import cookieParser from "cookie-parser";

import ErrorHandler from "@middleware/ErrorHandler";
import appRouter from "@routes/index";

dotenv.config();
const app: Application = express();
const port = config.get<number>("port");

// Middleware
app.use(cors({ origin: true }));
// Normal express config defaults
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(methodOverride());
app.use(express.static(__dirname + "/public"));

app.use(
	session({
		secret: "conduit",
		cookie: { maxAge: 60000 },
		resave: false,
		saveUninitialized: false,
	}),
);

// ERROR HANDLER MIDDLEWARE (Last middleware to use)
app.use(ErrorHandler);

app.use("/api", appRouter);

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
