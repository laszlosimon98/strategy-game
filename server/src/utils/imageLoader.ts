import fs from "fs/promises";
import path from "path";
import sizeOf from "image-size";
import { settings } from "@/settings";

export class Loader {
  private constructor() {}

  public static async loadImages(baseDir: string) {
    const files = await this.getFiles(baseDir);
    return this.generateRoutes(baseDir, files);
  }

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

  private static generateRoutes(baseDir: string, files: string[]) {
    const routes: Record<string, any> = {};

    for (const filePath of files) {
      const { width, height } = sizeOf(filePath);
      const relativePath = path.relative(baseDir, filePath).replace(/\\/g, "/");
      const parts = relativePath.split("/");
      const name = path.basename(filePath, ".png");
      const dirParts = parts.slice(0, -1);

      const url = `${process.env.SERVER_URL}/assets/${relativePath}`;

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
