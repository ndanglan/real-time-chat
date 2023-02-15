import prismaClient from "@config/prismaClient";

export const findUniqueUserById = async (uid: string) => {
	try {
		const user = await prismaClient.user.findUnique({
			where: {
				id: uid,
			},
		});

		return user;
	} catch (error) {
		console.log({ error });
	}
};

export const createUser = async (data: { id: string; email?: string }) => {
	try {
		const user = await prismaClient.user.create({
			data: {
				id: data.id,
				email: data.email || "",
			},
		});

		return user;
	} catch (error) {
		console.log(error);
	}
};
