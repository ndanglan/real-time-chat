import express from "express";
import { loginHandler, signUpHandler,refreshTokenHandler } from "../../../controllers/AuthController";

const app = express();

app.post("/login", loginHandler);
app.post("/signup", signUpHandler);
app.post("/token", refreshTokenHandler);

export default app;
