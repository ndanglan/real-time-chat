import { NextFunction, Request, Response } from "express";
import { verifyToken } from "@utils/jwt";

const authentication = (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	if (!token) {
		return res.status(401).send("Unauthorized");
	}
	try {
		verifyToken(token, "ACCESS_TOKEN_PRIVATE_KEY");
		next();
	} catch (error) {
		return res.status(401).send("Unauthorized");
	}
};

export default authentication;
