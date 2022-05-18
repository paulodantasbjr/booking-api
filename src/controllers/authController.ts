import { Request, Response, NextFunction } from "express";

import Bcrypt from "bcryptjs";

import { User } from "../models/UserModel";
import { createAccessToken } from "../utils/createAccessToken";
import { createRefreshToken } from "../utils/createRefreshToken";
import { createError } from "../utils/Error";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fullName, username, email, password } = req.body;

    const newUsername = username.toLowerCase().replace(/ /g, "");

    const checkUsername = await User.findOne({ username: newUsername });
    if (checkUsername)
      return next(createError("This user name already exists."));

    const checkEmail = await User.findOne({ email });
    if (checkEmail) return next(createError("This email already exists."));

    const passwordHash = await Bcrypt.hash(password, 12);

    const newUser = new User({
      fullName,
      username: newUsername,
      email,
      password: passwordHash,
    });

    const access_token = createAccessToken({ id: newUser._id });
    const refresh_token = createRefreshToken({ id: newUser._id });

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    });

    await newUser.save();

    res.status(200).json({
      success: "Register Success!",
      access_token,
      user: {
        ...newUser._doc,
      },
    });
  } catch (error: any) {
    return next(createError(error));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return next(createError("This email does not exist."));

    const isMatch = await Bcrypt.compare(password, user.password);
    if (!isMatch) return next(createError("Password is incorrect."));

    const access_token = createAccessToken({ id: user._id });
    const refresh_token = createRefreshToken({ id: user._id });

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
    });

    res.status(200).json({
      success: "Login Success!",
      access_token,
      user: {
        ...user._doc,
      },
    });
  } catch (error: any) {
    return next(createError(error));
  }
};

export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("refreshtoken", { path: "/api/refresh_token" });
    return res.status(200).json({
      success: "Logout Success!",
    });
  } catch (err) {
    return next(err);
  }
};
