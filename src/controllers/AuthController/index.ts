import { CookieOptions, NextFunction, Request, Response } from "express";
import { CreateUserInput, LoginUserInput } from "../../schemas/user.schema";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import config from "config";
import jwt_decode from "jwt-decode";
import jwt from "jsonwebtoken";

import { signToken } from "../../middleware/auth";

export const excludedFields = ["password"];

const prisma = new PrismaClient();
const accessTokenCookieOptions: CookieOptions = {
	expires: new Date(
		Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000,
	),
	maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
	httpOnly: true,
	sameSite: "lax",
};

if (process.env.NODE_ENV === "production")
	accessTokenCookieOptions.secure = true;

const loginHandler = async (
	req: Request<{}, {}, LoginUserInput>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				email: req.body.email,
			},
		});
		// Check if user exist and password is correct
		if (!user) {
			return res.status(401);
		}

		// Create an Access Token
		const { accessToken, refreshToken } = await signToken(user);

		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				refreshToken,
			},
		});

		// Send Access Token
		res.status(200).json({
			status: "success",
			accessToken,
			refreshToken,
			user,
		});
	} catch (err: any) {
		next(err);
	}
};

const signUpHandler = async (
	req: Request<{}, {}, CreateUserInput>,
	res: Response,
	next: NextFunction,
) => {
	try {
		const user = {
			email: req.body.email,
			password: bcrypt.hashSync(req.body.password, 8),
			firstName: req.body.firstName,
			lastName: req.body.lastName,
		};

		const response = await prisma.user.create({
			data: user,
		});

		res.status(201).json({
			status: "success",
			data: {
				response,
			},
		});
	} catch (err: any) {
		next(err);
	}
};

const refreshTokenHandler = async (
	req: Request<{}, {}, {
		refreshToken:string
	}>,
	res: Response,
	next: NextFunction,
) => {
	
	const refreshToken=req.body.refreshToken;
	const decodedToken:any =jwt_decode(refreshToken)
	if(!decodedToken) return res.sendStatus(401)

	const user = await prisma.user.findUnique({
		where:{
			id:decodedToken.id
		}
	})
	if(!user) return res.sendStatus(403)
	try {
		jwt.verify(
			refreshToken,
			config.get<string>("refreshTokenPrivateKey"),
		);
		// Create an Access Token
		const { accessToken, refreshToken:newRefreshToken } = await signToken(user);

		// Send Access Token
		res.status(200).json({
			status: "success",
			accessToken,
			refreshToken:newRefreshToken,
			user,
		});
	} catch (error) {
		console.log(error)
		next(error)
	}
};

export { loginHandler, signUpHandler,refreshTokenHandler };
