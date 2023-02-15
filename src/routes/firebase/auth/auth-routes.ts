import express from "express";
import {
	loginController,
	signUpController,
	refreshTokenController,
} from "@controllers/AuthController";

const app = express();

app.post("/login", loginController);
app.post("/signup", signUpController);
app.post("/refresh-token", refreshTokenController);

export default app;
