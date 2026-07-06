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

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);

    if (!verifiedToken) {
      return {
        success: false,
        error: "token invalid",
      };
    }

    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error) {
    console.log(`Token Error: ${error}`);
    throw new Error("Invalid token");
  }
};

export const jwtUtils = {
  createToken,
  verifyToken,
};
