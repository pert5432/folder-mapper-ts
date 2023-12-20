import * as fs from "fs";
import { ROOT_DIR } from "./root";
import { QueueElement } from "./types";
import path from "node:path";
import { FolderMap } from "./folder-map";

const INPUT_PATH = `${ROOT_DIR}/assets`;
const OUTPUT_PATH = `${ROOT_DIR}/map.ts`;

const readDirByRelativePath = async (
  relativePath: string
): Promise<fs.Dirent[]> =>
  new Promise((resolve, reject) => {
    fs.readdir(
      path.join(INPUT_PATH, relativePath),
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

const main = async () => {
  const map = new FolderMap(INPUT_PATH);

  let queue: QueueElement[] = (await readDirByRelativePath("/")).map(
    (entry) => ({
      relativePath: path.join("/", entry.name),
      entry,
    })
  );

  let currentRelativePath = "/";

  let entry = queue.pop();
  while (entry) {
    if (path.dirname(entry.relativePath) !== currentRelativePath) {
      currentRelativePath = path.dirname(entry.relativePath);
    }

    if (entry.entry.isFile()) {
      map.insertByRelativePath(entry.relativePath);
    } else if (entry.entry.isDirectory()) {
      const targetDir = path.join(currentRelativePath, entry.entry.name);

      const targetDirContents = await readDirByRelativePath(targetDir);

      queue.push(
        ...targetDirContents.map((entry) => ({
          entry,
          relativePath: path.join(targetDir, entry.name),
        }))
      );
    }

    entry = queue.pop();
  }

  fs.writeFileSync(
    OUTPUT_PATH,
    `export const MAP = ${JSON.stringify(map.map)}`
  );
};

main()
  .then(() => console.log("okaaaa"))
  .catch((e) => console.log(e));
