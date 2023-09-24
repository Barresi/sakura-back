import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export default {
  signup: function (req: Request, res: Response, next: NextFunction) {
    // https://stackoverflow.com/questions/2370015/regular-expression-for-password-validation
    const passwordRegex = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;

    const schema = z.object({
      email: z.string().email().trim(),
      password: z.string().regex(passwordRegex).trim(),
    });

    schema.parse(req.body);

    next();
  },
};
