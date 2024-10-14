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
    const result = this.generateroutes(_dir, files);
    return result;
  }

  private static generateroutes(_dir: string, files: string[]) {
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
      const a = _path.split("_");

      for (let i = a.length - 1; i > 0; --i) {
        routes[a[i - 1]] = {
          ...routes[a[i - 1]],
          [a[i]]: routes[a[i]],
        };

        delete routes[a[i]];
      }
    });

    return routes;
  }
}
