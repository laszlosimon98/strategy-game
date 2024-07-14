import { canvasHeight, canvasWidth, ctx } from "../init";
import { COLS, ROWS } from "../settings";
import Camera from "./camera/camera";
import { World } from "./world/world";
// import tree1 from "../assets/trees/tree1.png";
// import tree2 from "../assets/trees/tree2.png";
// import tree3 from "../assets/trees/tree3.png";
// import obstacleRock from "../assets/obstacles/rock_obstacle.png";
// import obstacleBush from "../assets/obstacles/bush_obstacle.png";
import test1 from "../assets/buildings/tower.png";
import test2 from "../assets/buildings/woodcutter.png";
import test3 from "../assets/buildings/forester.png";
import test4 from "../assets/buildings/sawmill.png";
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

    // for (let i = 0; i < this.board.length; ++i) {
    //   for (let j = 0; j < this.board[i].length; ++j) {
    //     const rnd = Math.floor(Math.random() * 100);

    //     const [posX, posY] = [
    //       i * TILESIZE + canvasWidth / 2 - TILESIZE,
    //       j * TILESIZE + canvasHeight / 4 - TILESIZE / 2,
    //     ];

    //     const [x, y] = this.world.getCoords(posX, posY);
    //     const coords: CoordsType = this.board[x][y].getBuildingPos();

    //     if (rnd < 55) {
    //       const rnd2 = Math.floor(Math.random() * 100);

    //       if (rnd2 < 1) {
    //         this.tile = obstacleBush;
    //       } else if (rnd2 < 2) {
    //         this.tile = obstacleRock;
    //       } else if (rnd2 < 5) {
    //         this.tile = tree1;
    //       } else if (rnd2 < 15) {
    //         this.tile = tree2;
    //       } else if (rnd2 < 25) {
    //         this.tile = tree3;
    //       }
    //     } else {
    //       this.tile = "";
    //     }

    //     console.log(x, y, posX, posY, this.tile);
    //     this.handleBuild(coords);
    //   }
    // }

    window.addEventListener("click", (e) => {
      const [posX, posY] = [e.clientX, e.clientY];
      const [x, y] = this.world.getCoords([posX, posY]);
      const coords = this.board[x][y].getBuildingPos();
      this.handleBuild(coords);
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
        this.tile = test1;
        break;
      case "2":
        this.tile = test2;
        break;
      case "3":
        this.tile = test3;
        break;
      case "4":
        this.tile = test4;
        break;
      default:
        this.tile = "";
        break;
    }
  };

  handleBuild = (coords: CoordsType): void => {
    if (this.tile !== "") {
      const building = {
        pos: coords,
        image: new Image(),
      };

      building.image.src = this.tile;

      const imageWidth = building.image.width;
      const imageHeight = building.image.height;

      building.pos = [coords[0] - imageWidth / 2, coords[1] - imageHeight];

      this.buildings.unshift(building);
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

    this.buildings.map((building) => {
      ctx.drawImage(building.image, ...building.pos);
    });
  };
}

export default Game;
