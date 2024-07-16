import { canvasHeight, canvasWidth, ctx } from "../init";
import { COLS, ROWS, TILESIZE } from "../settings";
import Camera from "./camera/camera";
import { World } from "./world/world";

import tree1 from "../assets/trees/tree1.png";
import tree2 from "../assets/trees/tree2.png";
import tree3 from "../assets/trees/tree3.png";
import obstacleRock from "../assets/obstacles/rock_obstacle.png";
import obstacleBush from "../assets/obstacles/bush_obstacle.png";

import smallResidence from "../assets/buildings/small_residence.png";
import woodcutter from "../assets/buildings/woodcutter.png";
import forester from "../assets/buildings/forester.png";
import sawmill from "../assets/buildings/sawmill.png";
import tower from "../assets/buildings/tower.png";

import { CoordsType } from "../types/coordsType";

class Game {
  private world: World;
  private camera: Camera;

  private tile: string;
  private board;

  private natures: {
    pos: CoordsType;
    image: HTMLImageElement;
  }[];

  private buildings: {
    pos: CoordsType;
    image: HTMLImageElement;
  }[];

  constructor() {
    this.camera = new Camera(0, 0, canvasWidth, canvasHeight);
    this.world = new World(ROWS, COLS, this.camera);

    this.board = this.world.getBoard();
    this.natures = [];
    this.buildings = [];
    this.tile = "";

    for (let i = 0; i < this.board.length; ++i) {
      for (let j = 0; j < this.board[i].length; ++j) {
        const rnd = Math.floor(Math.random() * 100);

        const coords: CoordsType = this.board[i][j].getBuildingPos();

        if (rnd < 20) {
          const rnd2 = Math.floor(Math.random() * 100);

          if (rnd2 < 1) {
            this.tile = obstacleBush;
          } else if (rnd2 < 2) {
            this.tile = obstacleRock;
          } else if (rnd2 < 5) {
            this.tile = tree1;
          } else if (rnd2 < 15) {
            this.tile = tree2;
          } else if (rnd2 < 25) {
            this.tile = tree3;
          }
        } else {
          this.tile = "";
        }

        this.handleBuild(coords, this.natures);
      }
    }

    window.addEventListener("mousedown", (e) => {
      const [posX, posY] = [e.clientX, e.clientY];
      const [x, y] = this.world.getCoords([posX, posY]);
      const coords = this.board[x][y].getBuildingPos();

      if (e.button === 0) {
        this.handleBuild(coords, this.buildings);
      } else if (e.button === 2) {
        this.destroyBuilding(coords);
      }
    });

    window.addEventListener("keypress", (e) => {
      this.chooseObstacle(e);
    });

    window.addEventListener("resize", () => {
      this.world.resize();
    });

    window.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  chooseObstacle = (e: KeyboardEvent): void => {
    switch (e.key) {
      case "1":
        this.tile = woodcutter;
        break;
      case "2":
        this.tile = forester;
        break;
      case "3":
        this.tile = sawmill;
        break;
      case "4":
        this.tile = tower;
        break;
      case "5":
        this.tile = smallResidence;
        break;
      default:
        this.tile = "";
        break;
    }
  };

  handleBuild = (coords: CoordsType, arr: typeof this.natures): void => {
    if (this.tile !== "") {
      const stuff = {
        pos: coords,
        image: new Image(),
      };

      stuff.image.src = this.tile;

      const imageWidth = stuff.image.width;
      const imageHeight = stuff.image.height;

      stuff.pos = [coords[0] - imageWidth / 2, coords[1] - imageHeight];

      arr.push(stuff);
    }
  };

  destroyBuilding = (coords: CoordsType): void => {
    const [cX, cY] = coords;
    let index = -1;

    for (let i = 0; i < this.buildings.length; ++i) {
      const [x, y] = this.buildings[i].pos;

      if (cX === x && cY === y) {
        index = i;
      }
    }

    if (index !== -1) {
      this.buildings = [
        ...this.buildings.slice(0, index),
        ...this.buildings.slice(index + 1),
      ];
    }
  };

  sortBuildings = (): void => {
    for (let i = this.board.length - 1; i >= 0; --i) {}
  };

  draw = (): void => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.world.draw();
    this.camera.draw();
  };

  update = (dt: number): void => {
    // this.camera.update();
    this.world.update(dt);

    this.natures.map((nature) => {
      ctx.drawImage(nature.image, ...nature.pos);
    });

    this.buildings.map((building, index) => {
      if (index === 2) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "rgb(255, 0, 0)";
      }
      ctx.drawImage(building.image, ...building.pos);
      ctx.restore();
    });
  };
}

export default Game;
