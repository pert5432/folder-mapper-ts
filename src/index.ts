import * as fs from "fs";
import { ROOT_DIR } from "./root";
import { FolderQueueElement } from "./types";
import path from "node:path";
import { FolderMap } from "./folder-map";
import { getDirContentsByAbsolutePath } from "./get-dir-contents";

const INPUT_PATH = `${ROOT_DIR}/assets`;
const OUTPUT_PATH = `${ROOT_DIR}/map.ts`;

const main = async (): Promise<void> => {
  const map = new FolderMap({
    path: INPUT_PATH,
    filenameFormatter: (filename: string) =>
      filename.split(" ").join("_").toUpperCase(),
    dirnameFormatter: (dirname: string) =>
      dirname.split(" ").join("_").toUpperCase(),
  });

  await mapFolder(map, INPUT_PATH);

  fs.writeFile(
    OUTPUT_PATH,
    `export const MAP = ${JSON.stringify(map.map)}`,
    { encoding: "utf-8" },
    (e) => {
      if (e) throw e;
    }
  );
};

const mapFolder = async (
  map: FolderMap,
  absolutePath: string
): Promise<void> => {
  const folderQueue: FolderQueueElement[] = [
    { relativePath: "/", name: path.dirname(absolutePath) },
  ];

  let currentElement = folderQueue.pop();
  while (currentElement) {
    const dirContents = await getDirContentsByAbsolutePath(
      path.join(absolutePath, currentElement.relativePath)
    );

    for (const entry of dirContents) {
      if (entry.isFile()) {
        map.insertFileByRelativePath(
          path.join(currentElement.relativePath, entry.name)
        );
      } else if (entry.isDirectory()) {
        folderQueue.push({
          name: entry.name,
          relativePath: path.join(currentElement.relativePath, entry.name),
        });
      }
    }

    currentElement = folderQueue.pop();
  }
};

main()
  .then(() => console.log("okaaaa"))
  .catch((e) => console.log(e));
