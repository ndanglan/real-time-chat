import { NextFunction, Request, Response } from "express";
import firebaseAdmin from "@config/firebase-admin";
import { TokenUserInput } from "@schemas/user.schema";
import { doLoginUser, doRefreshToken } from "@services/auth-services";

const loginController = async (
	req: Request<{}, {}, TokenUserInput>,
	res: Response,
	next: NextFunction,
) => {
	const { idToken } = req.body;
	try {
		const { accessToken, refreshToken, user } = await doLoginUser(idToken);
		res.status(200).json({ accessToken, refreshToken, userProfile: user });
	} catch (err: any) {
		next(err);
	}
};

const signUpController = async (
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

const refreshTokenController = async (
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
		const { accessToken, newRefreshToken } = await doRefreshToken(
			req.body.refreshToken,
		);

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

export { loginController, signUpController, refreshTokenController };
