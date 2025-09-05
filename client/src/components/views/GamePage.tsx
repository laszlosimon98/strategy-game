import main from "@/game/main";
import { useAppSelector } from "@/services/hooks/store.hooks";
import { useEffect, useRef } from "react";

const GamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { canvasWidth, canvasHeight } = useAppSelector((state) => state.canvas);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (canvasRef.current) {
      cleanup = main(canvasRef.current);
    }

    return () => {
      console.log("end");

      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* <SelectionPanel />
      {isModalVisible && <Modal />} */}

      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </div>
  );
};

export default GamePage;
