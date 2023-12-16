import { Folder } from "./types";
import path from "node:path";

export class FolderMap {
  private map: Folder = {};
  private rootPath: string;

  private currentPath = "/";
  private currentFolder = this.map;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
  }

  insertByRelativePath(relativePath: string): void {
    const folder = this.getFolderByRelativePath(relativePath, true);

    folder[path.basename(relativePath)] = path.join(
      this.rootPath,
      relativePath
    );
  }

  insert(filename: string): void {
    this.currentFolder[filename] = path.join(this.currentPath, filename);
  }

  cd(target: string): void {
    if (target === "..") {
      const destination = path.resolve(path.join(this.currentPath, target));

      this.currentFolder = this.getFolderByRelativePath(destination);
      this.currentPath = destination;
    } else {
      this.currentFolder = this.getFolderByRelativePath(
        path.join(this.currentPath, target)
      );
      this.currentPath = path.join(this.currentPath, target);
    }
  }

  private getFolderByRelativePath(
    relativePath: string,
    insert = false
  ): Folder {
    if (path.dirname(relativePath) === "/") {
      return this.map;
    }

    const folders = path.dirname(relativePath).split("/").slice(1);

    let currentFolder = this.map;
    for (const key of folders) {
      if (!currentFolder[key]) {
        if (!insert) {
          console.log(folders);
          throw new Error(`Invalid path - ${relativePath}`);
        } else {
          currentFolder[key] = {};
        }
      }

      currentFolder = currentFolder[key] as Folder;
    }

    return currentFolder;
  }
}
