import { config } from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import methodOverride from "method-override";
import session from "express-session";
import ErrorHandler from "./middleware/ErrorHandler";

config();
const app: Application = express();
const PORT = process.env.PORT;
// Middleware
app.use(cors());
// Normal express config defaults
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
app.use(ErrorHandler)



app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
