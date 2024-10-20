import fs from "fs/promises";
import path from "path";
import { SERVER_URL } from "../settings";
import sizeOf from "image-size";

export class Loader {
  private constructor() {}

  private static async getFiles(_dir: string): Promise<string[]> {
    const result: string[] = [];
    try {
      const files: string[] = await fs.readdir(_dir, { recursive: true });
      files.forEach((file) => {
        if (file.split(".")[1] === "png") {
          result.push(file.replace(/\\/g, "/"));
        }
      });
    } catch (error) {
      console.log(error);
    }

    return result;
  }

  public static async loadImages(_dir: string) {
    const files: string[] = await this.getFiles(_dir);
    const result = this.generateRoutes(_dir, files);
    return result;
  }

  private static generateRoutes(_dir: string, files: string[]) {
    const routes: any = {};
    const paths: string[] = [];

    files.forEach((file) => {
      const imageDimensions = sizeOf(`${_dir}/${file}`);
      const { width, height } = imageDimensions;

      const fileLength = file.split("/").length;
      const name = file.split("/")[fileLength - 1].split(".")[0];

      const _path: string[] = file.split("/").splice(0, fileLength - 1);

      const url: string = `${SERVER_URL}/assets/${path
        .join(..._path)
        .replace(/\\/g, "/")}/${name}.png`;
      const length = _path.length;

      routes[_path[length - 1]] = {
        ...routes[_path[length - 1]],
        [name]: {
          url,
          dimensions: { width, height },
        },
      };

      if (!paths.includes(_path.join("_"))) {
        paths.push(_path.join("_"));
      }
    });

    paths.forEach((_path) => {
      const dirs = _path.split("_");

      for (let i = dirs.length - 1; i > 0; --i) {
        routes[dirs[i - 1]] = {
          ...routes[dirs[i - 1]],
          [dirs[i]]: routes[dirs[i]],
        };
      }
    });

    Object.keys(routes).forEach((key) => {
      const arr: string[] = ["buildings", "colors", "ground", "menu", "ui"];
      if (!arr.some((dirName) => dirName === key)) {
        delete routes[key];
      }
    });

    return routes;
  }
}
