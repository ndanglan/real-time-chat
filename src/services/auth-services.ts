import firebaseAdmin from "@config/firebase-admin";
import { createUser, findUniqueUserById } from "@queries/user.prisma";
import { verifyToken } from "@utils/jwt";
import { signToken } from "@utils/auth-utils";

export const doLoginUser = async (idToken: string) => {
	const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
	let user = await findUniqueUserById(decodedToken.uid);
	if (!user) {
		// if not have user create user
		user = await createUser({ id: decodedToken.uid, email: decodedToken.email });
	}

	const { accessToken, refreshToken } = signToken({ sub: idToken });

	return { accessToken, refreshToken, user };
};

export const doRefreshToken = async (refreshToken: string) => {
	const decode = await verifyToken(refreshToken, "REFRESH_TOKEN_PRIVATE_KEY");

	// Create an Access Token
	const { accessToken, refreshToken: newRefreshToken } = await signToken({
		sub: decode.sub,
	});

	return { accessToken, newRefreshToken };
};
