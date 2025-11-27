import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1d" });

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

  // Check if user already exists
  const existing = await User.findOne({ username });
  if (existing) {
    const err = new Error("Username already exists");
    err.status = 400;
    throw err;
  }

  const hashed = await hashPassword(password);
  const user = await User.create({ username, password: hashed });
  const token = generateToken(user._id);
  return { user, token };
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

  const token = generateToken(user._id);
  return { user, token };
};