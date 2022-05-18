import jwt from "jsonwebtoken";

interface ICreateRefreshToken {
  id: string;
}

export const createRefreshToken = (payload: ICreateRefreshToken) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "30d",
  });
};
