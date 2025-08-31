import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

interface JwtPayload {
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.clearCookie("token");
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};