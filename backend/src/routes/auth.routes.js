import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";

import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later.",
    },
});

function createToken(user) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not configured.");
    }

    return jwt.sign(
        {
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            subject: user._id.toString(),
            expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        }
    );
}

function publicUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    };
}

// POST /api/auth/register
router.post("/register", authLimiter, async (req, res, next) => {
    try {
        const { name, email, password } = req.body ?? {};

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required.",
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (cleanName.length < 2 || cleanName.length > 80) {
            return res.status(400).json({
                success: false,
                message: "Name must be between 2 and 80 characters.",
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (cleanEmail.length > 254 || !emailPattern.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address.",
            });
        }

        if (password.length < 8 || password.length > 72) {
            return res.status(400).json({
                success: false,
                message: "Password must be between 8 and 72 characters.",
            });
        }

        const existingUser = await User.findOne({ email: cleanEmail });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        // Never accept the role from the request body.
        const user = await User.create({
            name: cleanName,
            email: cleanEmail,
            passwordHash,
        });

        const token = createToken(user);

        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            data: {
                user: publicUser(user),
                token,
            },
        });
    } catch (error) {
        // Handles two simultaneous registrations for the same email.
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
        }

        next(error);
    }
});

// POST /api/auth/login
router.post("/login", authLimiter, async (req, res, next) => {
    try {
        const { email, password } = req.body ?? {};

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            email.trim().length === 0 ||
            password.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required.",
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase(),
        }).select("+passwordHash");

        // Use the same response for an unknown email and a wrong password.
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password.",
            });
        }

        const token = createToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            data: {
                user: publicUser(user),
                token,
            },
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Account not found. Please log in again.",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                user: publicUser(user),
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;