import jwt, { SignOptions } from "jsonwebtoken";

export const signJwt = (
	payload: Object,
	options: SignOptions = {},
	key: string,
) => {
	return jwt.sign(payload, process.env[key] as string, {
		...(options && options),
	});
};

export const verifyToken = async (verifyKey:string,privateKey:string)=>{
	const decoded = await	jwt.verify(
			verifyKey,
			process.env[privateKey] as string,
		);

		return decoded
}
