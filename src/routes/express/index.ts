import express from "express";
import AuthRouter from './auth/auth-route'

const router = express();

router.use('/auth',AuthRouter)

export default router