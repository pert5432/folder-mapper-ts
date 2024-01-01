import { FolderMapper } from "./folder-mapper";
import { FolderMap, FolderMapperConfig } from "./types";

export const exportFolderMap = async (
  config: FolderMapperConfig & { outputPath: string }
): Promise<void> => {
  const map = new FolderMapper(config);

  await map.mapFolder();

  await map.writeMapToFile();
};

export const getMap = async (
  config: FolderMapperConfig
): Promise<FolderMap> => {
  const map = new FolderMapper(config);

  await map.mapFolder();

  return map.map;
};
