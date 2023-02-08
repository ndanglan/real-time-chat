export interface IUser {
	email: string;
	password: string;
	firstName?: string;
	lastName?: string;
	isVerified?: boolean;
	accessToken?: string;
	refreshToken?: string;
	provider?: string;
	role?: string;
}
