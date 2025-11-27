import fs from "fs/promises";
import path from "path";
import sizeOf from "image-size";

/**
 * Képfájlok betöltéséért és asset útvonalak generálásáért felelős segédosztály.
 */
export class Loader {
  private constructor() {}

  /**
   * Beolvassa a `baseDir` mappából a PNG képeket és előállítja a mappastruktúra szerinti url-t.
   * @param baseDir - az assets gyökérkönyvtára
   * @returns az assets struktúrája URL-ekkel és méretekkel
   */
  public static async loadImages(baseDir: string) {
    const files = await this.getFiles(baseDir);
    return this.generateRoutes(baseDir, files);
  }

  /**
   * Rekurzívan összegyűjti egy könyvtár összes PNG fájljának elérési útját.
   * @param dir - a keresés kiinduló könyvtára
   * @returns a talált PNG fájlok teljes elérési útjai
   */
  private static async getFiles(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dir, entry.name);
        return entry.isDirectory() ? await this.getFiles(fullPath) : fullPath;
      })
    );

    return files.flat().filter((file) => file.endsWith(".png"));
  }

  /**
   * Előállítja a mappastruktúra szerinti url-t.
   * @param baseDir - az assets gyökérkönyvtár
   * @param files - a PNG fájlok teljes elérési útjai
   * @returns rendezett objektum, amely mappánként tartalmazza az asseteket
   */
  private static generateRoutes(baseDir: string, files: string[]) {
    const routes: Record<string, any> = {};

    for (const filePath of files) {
      const { width, height } = sizeOf(filePath);
      const relativePath = path.relative(baseDir, filePath).replace(/\\/g, "/");
      const parts = relativePath.split("/");
      const name = path.basename(filePath, ".png");
      const dirParts = parts.slice(0, -1);

      const url = `http://${process.env.HOST}:${process.env.PORT}/assets/${relativePath}`;

      let current = routes;
      for (const dir of dirParts) {
        if (!current[dir]) current[dir] = {};
        current = current[dir];
      }

      current[name] = {
        url,
        dimensions: { width, height },
      };
    }

    return routes;
  }
}
