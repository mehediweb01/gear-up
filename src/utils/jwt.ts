import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  expireIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expireIn,
  } as SignOptions);

  return token;
};

export const jwtUtils = {
  createToken,
};
