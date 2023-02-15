import express from "express";
import expressRouter from "./express";
import firebaseRouter from "./firebase";

const app = express();

app.use("/", expressRouter);
app.use("/", firebaseRouter);

export default app;
