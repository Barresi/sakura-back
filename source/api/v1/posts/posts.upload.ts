import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import createUserFolder from "./posts.folder";

export const folderPath = "/app/images/posts";

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const userId = req.userId;
      createUserFolder(userId);
      if (file.fieldname === "pictures") {
        cb(null, `${folderPath}/${userId}`);
      } else {
        const error = new Error("ENOENT");
        cb(error, "images");
      }
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = uuidv4() + ext;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
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
      cb(error);
    } else {
      cb(null, true);
    }
  },
  limits: {
    fileSize: 3 * 1024 * 1024,
    files: 4,
  },
});
