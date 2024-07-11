import { canvasHeight, canvasWidth, ctx } from "../init";
import { COLS, ROWS } from "../settings";
import Camera from "./camera/camera";
import { World } from "./world/world";
import tree1 from "../assets/tree1.png";
import tree2 from "../assets/tree2.png";
import tree3 from "../assets/tree3.png";
import { CoordsType } from "../types/coordsType";

class Game {
  private world: World;
  private camera: Camera;

  private tile: string;
  private board;

  private buildings: {
    pos: CoordsType;
    image: HTMLImageElement;
  }[];

  constructor() {
    this.camera = new Camera(0, 0, canvasWidth, canvasHeight);
    this.world = new World(ROWS, COLS, this.camera);

    this.board = this.world.getBoard();
    this.buildings = [];
    this.tile = "";

    window.addEventListener("click", (e) => {
      const [x, y] = this.world.getCoords(e);
      this.world.setTile(x, y);

      const building = {
        pos: this.board[x][y].getBuildingPos(),
        image: new Image(),
      };

      this.tile = tree3;
      building.image.src = this.tile;
      this.buildings.push(building);
    });

    // for (let i = 0; i < this.board.length; ++i) {
    //   for (let j = 0; j < this.board[i].length; ++j) {
    //     const rnd = Math.floor(Math.random() * 1000);
    //     const building = {
    //       pos: this.board[i][j].getBuildingPos(),
    //       image: new Image(),
    //     };

    //     if (rnd < 1) {
    //       building.image.src = tower;
    //     } else if (rnd < 2) {
    //       building.image.src = sawmill;
    //     } else if (rnd < 3) {
    //       building.image.src = woodcutter;
    //     } else if (rnd < 4) {
    //       building.image.src = stonecutter;
    //     } else if (rnd < 10) {
    //       building.image.src = stone;
    //     } else if (rnd < 15) {
    //       building.image.src = tree1;
    //     } else if (rnd < 25) {
    //       building.image.src = tree2;
    //     } else if (rnd < 35) {
    //       building.image.src = tree3;
    //     }
    //     this.buildings.push(building);
    //   }
    // }

    window.addEventListener("keypress", (e) => {
      //   switch (e.key) {
      //     case "1":
      //       this.tile = tower;
      //       break;
      //     case "2":
      //       this.tile = sawmill;
      //       break;
      //     case "3":
      //       this.tile = stonecutter;
      //       break;
      //     case "4":
      //       this.tile = woodcutter;
      //       break;
      //     default:
      //       this.tile = tower;
      //       break;
      //   }
    });

    window.addEventListener("resize", () => {
      this.world.resize();
    });

    window.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  draw = (): void => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.world.draw();
    this.camera.draw();
  };

  update = (dt: number): void => {
    // this.camera.update();
    this.world.update(dt);

    this.buildings.map((building) => {
      ctx.drawImage(building.image, ...building.pos);
    });
  };
}

export default Game;
