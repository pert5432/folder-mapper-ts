import * as fs from "fs";

export const getDirContentsByAbsolutePath = async (
  absolutePath: string
): Promise<fs.Dirent[]> =>
  new Promise((resolve, reject) => {
    fs.readdir(
      absolutePath,
      { encoding: "utf-8", withFileTypes: true },
      (e: NodeJS.ErrnoException | null, files: fs.Dirent[]) => {
        if (e) {
          reject(e);
        } else {
          resolve(files);
        }
      }
    );
  });
