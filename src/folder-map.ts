import {
  DirnameFormatter,
  FilenameFormatter,
  Folder,
  MapConfig,
} from "./types";
import path from "node:path";

const DEFAULT_FILENAME_FORMATTER: FilenameFormatter = (filename: string) =>
  filename;

const DEFAULT_DIRNAME_FORMATTER: DirnameFormatter = (dirname: string) =>
  dirname;

export class FolderMap {
  private _map: Folder = {};
  private rootPath: string;

  private filenameFormatter: FilenameFormatter;
  private dirnameFormatter: DirnameFormatter;

  constructor({ path, filenameFormatter, dirnameFormatter }: MapConfig) {
    this.rootPath = path;
    this.filenameFormatter = filenameFormatter ?? DEFAULT_FILENAME_FORMATTER;
    this.dirnameFormatter = dirnameFormatter ?? DEFAULT_DIRNAME_FORMATTER;
  }

  get map() {
    return this._map;
  }

  insertByRelativePath(relativePath: string): void {
    const folder = this.getFolderByRelativePath(relativePath, true);

    folder[this.filenameFormatter(path.basename(relativePath))] = path.join(
      this.rootPath,
      relativePath
    );
  }

  private getFolderByRelativePath(
    relativePath: string,
    insert = false
  ): Folder {
    if (path.dirname(relativePath) === "/") {
      return this._map;
    }

    const folders = path.dirname(relativePath).split("/").slice(1);

    let currentFolder = this._map;
    for (const key of folders) {
      const formattedKey = this.dirnameFormatter(key);

      if (!currentFolder[formattedKey]) {
        if (!insert) {
          console.log(folders);
          throw new Error(`Invalid path - ${relativePath}`);
        } else {
          currentFolder[formattedKey] = {};
        }
      }

      currentFolder = currentFolder[formattedKey] as Folder;
    }

    return currentFolder;
  }
}
