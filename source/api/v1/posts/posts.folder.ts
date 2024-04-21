import fs from "fs";
import { folderPath } from "./posts.upload";

const createUserFolder = (userId: string) => {
  const fullFolderPath = `${folderPath}/${userId}`;
  if (!fs.existsSync(fullFolderPath)) {
    fs.mkdirSync(fullFolderPath, { recursive: true });
  }
};

export default createUserFolder;
