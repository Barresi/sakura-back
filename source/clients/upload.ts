import multer from "multer";
import path from "path";
import { Request } from "express";

export const upload = multer({
  storage: multer.diskStorage({
    destination: "images/avatars",
    filename: (req, file, cb) => {
      const userId = req.userId;
      const extension = path.extname(file.originalname);
      cb(null, `${userId}${extension}`);
    },
  }),

  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const validTypes = [
      ".apng",
      ".png",
      ".jpg",
      ".jpeg",
      ".jfif",
      ".pjpeg",
      ".pjp",
      ".gif",
      ".svg",
      ".ico",
      ".webp",
      ".avif",
    ];
    const extension = path.extname(file.originalname);
    if (!validTypes.includes(extension)) {
      const error = new Error("Неверный формат аватарки");
      (error as any).status = 400;
      cb(error);
    } else {
      cb(null, true);
    }
  },

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});
