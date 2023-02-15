import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import firebaseAdmin from "@config/firebase-admin";

import { signToken } from "@middleware/auth";
import { verifyToken } from "@utils/jwt";
import { TokenUserInput } from "@schemas/user.schema";

export const excludedFields = ["password"];

const prisma = new PrismaClient();

const loginHandler = async (
	req: Request<{}, {}, TokenUserInput>,
	res: Response,
	next: NextFunction,
) => {
	const { idToken } = req.body;
	try {
		const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
		const { accessToken, refreshToken } = await signToken({
			sub: decodedToken.uid,
		});

		return res.status(201).json({ accessToken, refreshToken });
	} catch (err: any) {
		next(err);
	}
};

const signUpHandler = async (
	req: Request<{}, {}, TokenUserInput>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.body.idToken;
		const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
		const userRecord = await firebaseAdmin.auth().getUser(decodedToken.uid);
		console.log({ userRecord });
		// await prisma.user.create({
		// 	data: {
		// 		id:userRecord.uid as string,
		// 		email:userRecord.email as string,
		// 		firstName:userRecord.displayName?.split(" ")[0] as string ,
		// 		lastName:userRecord.displayName?.split(" ")[1] as string
		// 	},
		// });

		// res.status(201).json({
		// 	status:"success",
		// 	message:"Create account success"
		// });
	} catch (err: any) {
		next(err);
	}
};

const refreshTokenHandler = async (
	req: Request<
		{},
		{},
		{
			refreshToken: string;
		}
	>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const decode = await verifyToken(
			req.body.refreshToken,
			"REFRESH_TOKEN_PRIVATE_KEY",
		);
		// Create an Access Token
		const { accessToken, refreshToken: newRefreshToken } = await signToken({
			sub: decode.sub,
		});

		// Send Access Token
		res.status(200).json({
			status: "success",
			accessToken,
			refreshToken: newRefreshToken,
		});
	} catch (error) {
		console.log(error);
		next(error);
	}
};

export { loginHandler, signUpHandler, refreshTokenHandler };
