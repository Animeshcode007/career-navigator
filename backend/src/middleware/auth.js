import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication required.",
        });
    }

    const token = authorization.slice(7);

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        if (!payload.sub || !payload.role) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token.",
            });
        }

        req.user = {
            id: payload.sub,
            role: payload.role,
        };

        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token.",
        });
    }
}

export function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this resource.",
            });
        }

        next();
    };
}