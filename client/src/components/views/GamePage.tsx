import main from "@/game/main";
import { useAppDispatch, useAppSelector } from "@/services/hooks/store.hooks";
import { setModalVisibility } from "@/services/slices/modal.slice";
import { useEffect, useRef } from "react";

const GamePage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dispatch = useAppDispatch();
  const { canvasWidth, canvasHeight } = useAppSelector((state) => state.canvas);
  const isModalVisible = useAppSelector((state) => state.modal.isModalVisible);

  useEffect(() => {
    if (canvasRef.current) {
      main(canvasRef.current);
    }

    return () => {
      console.log("end");
    };
  }, []);

  return (
    <div
      className="relative"
      onClick={() => dispatch(setModalVisibility(false))}
    >
      {/* <SelectionPanel />
      {isModalVisible && <Modal />} */}

      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </div>
  );
};

export default GamePage;
