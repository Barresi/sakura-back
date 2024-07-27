import multer from "multer";
import path from "path";
import { Request } from "express";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const avatarFolderPath = "/app/images/avatars";
export const bannerFolderPath = "/app/images/banners";

const createFolderIfNotExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const deleteOldFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.userId;
    let folderPath = "";

    if (file.fieldname === "avatar") {
      folderPath = `${avatarFolderPath}/${userId}`;
    } else if (file.fieldname === "banner") {
      folderPath = `${bannerFolderPath}/${userId}`;
    } else {
      return cb(new Error("ENOENT"), "");
    }

    createFolderIfNotExists(folderPath);
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const filename = uuidv4() + extension;
    cb(null, filename);
  },
});

const fileFilter = (
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
    return cb(new Error("Invalid file type"));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

export const deleteOldFileUtility = deleteOldFile;
