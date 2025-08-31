import * as fs from 'fs/promises';
import { BadRequestException, Injectable } from '@nestjs/common';
import * as path from 'path';
import sizeOf from 'image-size';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';

@Injectable()
export class ImageSenderService {
  constructor(private readonly configService: ConfigService) {}

  private async getFiles(_dir: string): Promise<string[]> {
    const result: string[] = [];
    try {
      const files: string[] = await fs.readdir(_dir, { recursive: true });
      files.forEach((file) => {
        if (file.split('.')[1] === 'png') {
          result.push(file.replace(/\\/g, '/'));
        }
      });
    } catch (error) {
      throw new BadRequestException('Hiba történt a fájlok lekérése során');
    }

    return result;
  }

  private generateRoutes(_dir: string, files: string[]) {
    const serverUrl = `${this.configService.getOrThrow<string>('SERVER_URL')}:${this.configService.getOrThrow<string>('PORT')}`;
    const routes: any = {};
    const paths: string[] = [];
    files.forEach((file) => {
      const buffer = readFileSync(`${_dir}/${file}`);
      const imageDimensions = sizeOf(buffer);
      const { width, height } = imageDimensions;

      const fileLength = file.split('/').length;
      const name = file.split('/')[fileLength - 1].split('.')[0];

      const _path: string[] = file.split('/').splice(0, fileLength - 1);

      const url: string = `${serverUrl}/assets/${path
        .join(..._path)
        .replace(/\\/g, '/')}/${name}.png`;
      const length = _path.length;

      routes[_path[length - 1]] = {
        ...routes[_path[length - 1]],
        [name]: {
          url,
          dimensions: { width, height },
        },
      };

      if (!paths.includes(_path.join('_'))) {
        paths.push(_path.join('_'));
      }
    });

    paths.forEach((_path) => {
      const dirs = _path.split('_');

      for (let i = dirs.length - 1; i > 0; --i) {
        routes[dirs[i - 1]] = {
          ...routes[dirs[i - 1]],
          [dirs[i]]: routes[dirs[i]],
        };
      }
    });

    Object.keys(routes).forEach((key) => {
      const arr: string[] = [
        'buildings',
        'colors',
        'ground',
        'menu',
        'ui',
        'obstacles',
      ];
      if (!arr.some((dirName) => dirName === key)) {
        delete routes[key];
      }
    });

    return routes;
  }

  public async loadImages(_dir: string) {
    const files: string[] = await this.getFiles(_dir);
    const result = this.generateRoutes(_dir, files);
    console.log(result);
    return result;
  }
}
