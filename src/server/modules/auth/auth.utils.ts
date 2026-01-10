import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import type { Types } from "mongoose";

export const createToken = (
  jwtPayload: { userId: Types.ObjectId; role: string; email: string },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  } as SignOptions);
};

export const verifyToken = (token: string, secret: string) => {
  const newToken = token.includes("Bearer")
    ? (token.split(" ")[1] as string)
    : (token as string);
  return jwt.verify(newToken, secret) as JwtPayload;
};
