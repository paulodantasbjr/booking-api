import jwt from "jsonwebtoken";

interface ICreateAccessToken {
  id: string;
}

export const createAccessToken = (payload: ICreateAccessToken) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "1d",
  });
};
