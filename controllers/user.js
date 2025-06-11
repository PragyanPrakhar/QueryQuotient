import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { inngest } from "../inngest/client.js";

export const signup = async (req, res) => {
    const { username, email, password, skills = [] } = req.body;
    try {
        if (!email || !username || !password) {
            return res.status(400).json({
                error: "Email, username and password are required",
            });
        }
        // Check if the user already exists
        const existingUser = await User.findOne({
            email,
        });
        if (existingUser) {
            return res.status(400).json({
                error: "User already exists with this email",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            skills,
        });

        const savedUser = await user.save();

        // Now we will trigger the inngest event
        // the use of await is to ensure that the event is processed before sending the response
        // this is not necessary buresponse immediately, you can remove the await keyword
        // and the event will stillt it is a good practice to ensure that the event is processed before sending the response
        // if you want to send the  be processed in the background
        await inngest.send({
            name: "user/signup",
            data: {
                email: user.email,
                username: user.username,
            },
        });
        console.log("📨 Event sent: user/signup");

        const token = jwt.sign(
            { _id: savedUser._id, role: savedUser.role },
            process.env.JWT_SECRET
        );
        // Set the token in cookies
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set to true in production
            sameSite: "Strict", // Helps prevent CSRF attacks
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.status(201).json({
            message: "User signed up successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                skills: user.skills,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error signing up user",
            details: error.message,
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required",
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                error: "Invalid credentials",
            });
        }
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Set to true in production
            sameSite: "Strict", // Helps prevent CSRF attacks
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.status(201).json({
            message: "Login Successful",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                skills: user.skills,
            },
            token,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error logging in user",
            details: error.message,
        });
    }
};

export const logout = async (req, res) => {
    try {
        /* const token = req.headers.authorization.split(" ")[1]; // Invalidate the token by setting it to null
        if (!token) {
            return res.status(400).json({
                error: "No token provided",
            });
        } */
        /* jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    error: "Invalid token",
                });
            }
        }); */
        res.clearCookie("token");

        return res.status(200).json({
            message: "User logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error logging out user",
            details: error.message,
        });
    }
};

export const updateUser = async (req, res) => {
    const { skills = [], role, email } = req.body;
    try {
        if (req.user?.role !== "admin") {
            return res.status(403).json({
                error: "You are not authorized to update user",
            });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }
        const result = await User.updateOne(
            { email },
            {
                $set: {
                    skills,
                    role,
                },
            }
        );
        if (result.modifiedCount === 0) {
            return res.status(400).json({
                error: "User not updated",
            });
        }
        return res.json({
            message: "User updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating user",
            details: error.message,
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({
                error: "You are not authorized to get user",
            });
        }
        const users = await User.find({}, "-password").sort({ createdAt: -1 });
        return res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({
            message: "Error getting users",
            details: error.message,
        });
    }
};

export const getSelfProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id, "-password");
        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }
        return res.status(200).json({
            message: "Profile details fetched successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error getting user profile",
            details: error.message,
        });
    }
};
