import UserModel from "../../../models/UserModel.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
	try {
		const users = await UserModel.findAll({
			attributes: { exclude: ['password', 'salt'] }
		});
		res.status(200).json({ users, ok: true });
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message, ok: false });
	}
};

export const deleteUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const user = await UserModel.findByPk(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found", ok: false });
		}

		await user.destroy();
		res.status(200).json({ message: "User deleted", ok: true });
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message, ok: false });
	}
};

export const addUser = async (req, res) => {
	try {
		const { username, email, password, role } = req.body;

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await UserModel.create({
			username,
			email,
			password: hashedPassword,
			salt,
			role,
		});

		res.status(201).json({ message: "User created", user: { id: user.id, username: user.username, email: user.email, role: user.role }, ok: true });
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message, ok: false });
	}
};
