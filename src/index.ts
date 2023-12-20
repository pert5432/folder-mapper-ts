import * as fs from "fs";
import { ROOT_DIR } from "./root";
import { QueueElement } from "./types";
import path from "node:path";
import { FolderMap } from "./folder-map";

const INPUT_PATH = `${ROOT_DIR}/assets`;
const OUTPUT_PATH = `${ROOT_DIR}/map.ts`;

const main = async () => {
  const map = new FolderMap(INPUT_PATH);

  await mapFolder(map, INPUT_PATH);

  fs.writeFileSync(
    OUTPUT_PATH,
    `export const MAP = ${JSON.stringify(map.map)}`
  );
};

const mapFolder = async (map: FolderMap, absolutePath: string) => {
  let queue: QueueElement[] = (await readDirByAbsolutePath(absolutePath)).map(
    (entry) => ({
      relativePath: path.join("/", entry.name),
      entry,
    })
  );

  let currentEntry = queue.pop();
  while (currentEntry) {
    if (currentEntry.entry.isFile()) {
      map.insertByRelativePath(currentEntry.relativePath);
    } else if (currentEntry.entry.isDirectory()) {
      const targetDirRelativePath = path.join(
        path.dirname(currentEntry.relativePath),
        currentEntry.entry.name
      );

      const targetDirContents = await readDirByAbsolutePath(
        path.join(absolutePath, targetDirRelativePath)
      );

      queue.push(
        ...targetDirContents.map((entry) => ({
          entry,
          relativePath: path.join(targetDirRelativePath, entry.name),
        }))
      );
    }

    currentEntry = queue.pop();
  }
};

const readDirByAbsolutePath = async (
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

main()
  .then(() => console.log("okaaaa"))
  .catch((e) => console.log(e));
