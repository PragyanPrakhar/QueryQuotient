import jwt from "jsonwebtoken";
export const authenticate = (req, res, next) => {
    // TODO : We can print the headers to check all the headers.
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded; // Attach the decoded user info to the request object
        next(); // Call the next middleware or route handler
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};
