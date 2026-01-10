import { AuthService } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

// login user controller
const loginUser = catchAsync(async (req, res) => {
	const result = await AuthService.loginUser(req.body);
	const { refreshToken, accessToken } = result;

	res.cookie("refreshToken", refreshToken, {
		secure: true,
		httpOnly: true,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24 * 30,
	});

	res.cookie("accessToken", accessToken, {
		secure: true,
		httpOnly: true,
		sameSite: "none",
		maxAge: 1000 * 60 * 60 * 24,
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User is logged in successfully!",
		data: {
			accessToken,
			refreshToken,
		},
	});
});

// register user controller
const registerUser = catchAsync(async (req, res) => {
	const user = await AuthService.registerUser(req.body);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "User created successfully",
		data: user,
	});
});

// generate refresh token controller
const refreshToken = catchAsync(async (req, res) => {
	const { refreshToken } = req.cookies;
	const result = await AuthService.refreshToken(refreshToken);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Access token is retrieved successfully!",
		data: result,
	});
});

// change password controller
const changePassword = catchAsync(async (req, res) => {
	const { ...passwordData } = req.body;

	const result = await AuthService.changePassword(req.user, passwordData);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Password is updated successfully!",
		data: result,
	});
});

// forgot password controller
const forgotPassword = catchAsync(async (req, res) => {
	const { email } = req.body;

	await AuthService.forgotPassword(email);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Password reset code is sent to your email",
		data: null,
	});
});

// reset password controller
const resetPassword = catchAsync(async (req, res) => {
	const { code, password, email } = req.body;

	await AuthService.resetPassword(code, password, email);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Password is reset successfully!",
		data: null,
	});
});

export const AuthController = {
	loginUser,
	registerUser,
	changePassword,
	refreshToken,
	forgotPassword,
	resetPassword,
};
