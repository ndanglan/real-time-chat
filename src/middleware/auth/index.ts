import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";
import { NextFunction, Request, Response } from "express";

export const signJwt = (
	payload: Object,
	options: SignOptions = {},
	key: string,
) => {
	return jwt.sign(payload, config.get<string>(key), {
		...(options && options),
	});
};

export const signToken = async (user: any) => {
	// Sign the access token
	const access_token = signJwt(
		user,
		{
			expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
		},
		"accessTokenPrivateKey",
	);

	// Sign the refresh token
	const refresh_token = signJwt(
		user,
		{
			expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`,
		},
		"refreshTokenPrivateKey",
	);
		console.log('refresh_token',refresh_token)
	// Return access token
	return { accessToken: access_token, refreshToken: refresh_token };
};

export const verifyToken = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.header("Authorization");
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) return res.sendStatus(401);

	try {
		const decoded = jwt.verify(
			token,
			config.get<string>("accessTokenPrivateKey"),
		);
		console.log(decoded);
	} catch (error) {
		console.log(error);
		return res.sendStatus(403);
	}
};
