import dotenv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import methodOverride from "method-override";
import session from "express-session";
import ErrorHandler from "./middleware/ErrorHandler";
import router from "./routes/express";
import config  from "config";

dotenv.config();
const app: Application = express();
const port = config.get<number>('port');
// Middleware
app.use(cors({origin:true}));
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

app.use('/api',router)

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
