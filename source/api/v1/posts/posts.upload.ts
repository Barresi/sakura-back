import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import createUserFolder from "./posts.folder";

export const folderPath = `/app/images/posts`;

export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const userId = req.userId;
      createUserFolder(userId);
      cb(null, `${folderPath}/${userId}`);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = uuidv4() + ext;
      cb(null, filename);
    },
  }),
});
