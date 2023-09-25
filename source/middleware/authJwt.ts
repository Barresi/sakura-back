import config from 'config';
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface JWTDecoded extends JwtPayload {
  userId: number;
}

interface Request extends ExpressRequest {
  userId?: number;
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({
      message: 'No token provided!',
    });
  }

  const secret: jwt.Secret = String(config.get('auth.accessTokenSecret'));

  try {
    const decoded = await jwtVerify(token, secret);

    if (decoded) {
      req.userId = decoded.userId;
    }

    next();
  } catch (err) {
    return res.status(401).send({
      message: 'Unauthorized!',
    });
  }
};

const jwtVerify = (token: string, secret: jwt.Secret): Promise<JWTDecoded> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as JWTDecoded);
      }
    });
  });
};

const authJwt = {
  verifyToken,
};

export default authJwt;
