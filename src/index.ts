import { ROOT_DIR } from "./root";
import { FolderMapper } from "./folder-mapper";

const INPUT_PATH = `${ROOT_DIR}/assets`;
const OUTPUT_PATH = `${ROOT_DIR}/map.ts`;

const main = async (): Promise<void> => {
  const map = new FolderMapper({
    path: INPUT_PATH,
  });

  await map.mapFolderByAbsolutePath(INPUT_PATH);

  await map.writeMapToFile(OUTPUT_PATH);
};

main()
  .then(() => console.log("okaaaa"))
  .catch((e) => console.log(e));
