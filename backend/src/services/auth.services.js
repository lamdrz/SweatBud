import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

export const registerUser = async ({ username, password }) => {
  if (!username || !password) {
    const err = new Error("Username and password required");
    err.status = 400;
    throw err;
  }

  const existing = await User.findOne({ username });
  if (existing) {
    const err = new Error("Username already exists");
    err.status = 400;
    throw err;
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ username, password: hashed });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const authenticateUser = async ({ username, password }) => {
  if (!username || !password) {
    const err = new Error("Username and password required");
    err.status = 400;
    throw err;
  }

  // Check if user exists
  const user = await User.findOne({ username });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  // Verify password
  const ok = await comparePassword(password, user.password);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return { user, accessToken, refreshToken };
};

export const refreshAccessToken = async (token) => {
    if (!token) {
        const err = new Error("Refresh token required");
        err.status = 401;
        throw err;
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
        const err = new Error("Invalid refresh token");
        err.status = 403;
        throw err;
    }

    const accessToken = generateAccessToken(user._id);
    return { accessToken };
};

export const logoutUser = async (token) => {
    if (!token) return;

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (user) {
        user.refreshToken = null;
        await user.save();
    }
};