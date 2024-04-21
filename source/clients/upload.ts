import multer from "multer";
import path from "path";
import { Request } from "express";

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const type = file.fieldname;
      if (type === "avatar") {
        cb(null, "/app/images/avatars");
      } else if (type === "banner") {
        cb(null, "/app/images/banners");
      } else {
        const error = new Error("Invalid file type");
        (error as any).status = 400;
        cb(error, "images");
      }
    },
    filename: (req, file, cb) => {
      const userId = req.userId;
      const extension = path.extname(file.originalname);
      const prefix = file.fieldname;
      cb(null, `${prefix}-${userId}${extension}`);
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
      const error = new Error("Invalid file type");
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
