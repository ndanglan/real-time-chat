import config from "config";
import { signJwt } from "@utils/jwt";

export const signToken = async (payload: any) => {
	// Sign the access token
	const access_token = signJwt(
		payload,
		{
			expiresIn: `${config.get<number>("accessTokenExpiresIn")}m`,
		},
		"ACCESS_TOKEN_PRIVATE_KEY",
	);

	// Sign the refresh token
	const refresh_token = signJwt(
		payload,
		{
			expiresIn: `${config.get<number>("refreshTokenExpiresIn")}m`,
		},
		"REFRESH_TOKEN_PRIVATE_KEY",
	);

	// Return access token
	return { accessToken: access_token, refreshToken: refresh_token };
};
