import Modal from "@/src/features/gamepage/components/Modal";
import SelectionPanel from "@/src/features/gamepage/components/SelectionPanel";
import main from "@/src/game/main";
import {
  useAppDispatch,
  useAppSelector,
} from "@/src/services/hooks/storeHooks";
import { setModalVisibility } from "@/src/services/slices/modalSlice";
import { ReactElement, useEffect, useRef } from "react";

const GamePage = (): ReactElement => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dispatch = useAppDispatch();
  const { canvasWidth, canvasHeight } = useAppSelector((state) => state.canvas);
  const isModalVisible = useAppSelector((state) => state.modal.isModalVisible);

  // useEffect(() => {
  //   const handleResize = () => {
  //     dispatch(
  //       updateCanvasSize({
  //         canvasWidth: window.innerWidth,
  //         canvasHeight: window.innerHeight,
  //       })
  //     );
  //   };

  //   const handleKeyUp = (event: KeyboardEvent) => {
  //     if (event.key === "F11") {
  //       handleResize();
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);
  //   window.addEventListener("keyup", handleKeyUp);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //     window.removeEventListener("keyup", handleKeyUp);
  //   };
  // }, [canvasHeight, canvasWidth, dispatch]);

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
      <SelectionPanel />
      {isModalVisible && <Modal />}

      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </div>
  );
};

export default GamePage;
