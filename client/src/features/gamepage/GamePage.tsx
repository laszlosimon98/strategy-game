import main from "@/game/main";
import Modal from "features/gamepage/components/Modal";
import SelectionPanel from "features/gamepage/components/SelectionPanel";
import { ReactElement, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "services/hooks/storeHooks";
import { setModalVisibility } from "services/slices/modalSlice";

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
