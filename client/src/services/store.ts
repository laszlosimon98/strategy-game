import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/src/services/slices/auth.slice";
import canvasReducer from "@/src/services/slices/canvas.slice";
import gameReducer from "@/src/services/slices/game.slice";
import modalReducer from "@/src/services/slices/modal.slice";
import utilsReducer from "@/src/services/slices/init.slice";

const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    game: gameReducer,
    auth: authReducer,
    modal: modalReducer,
    utils: utilsReducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: ['game/'],
      //   ignoredPaths: ["game"],
      // },
      serializableCheck: false,
    });
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectState = <T>(selector: (state: RootState) => T): T => {
  return selector(store.getState());
};

export const getState = <T>(
  selector: (state: ReturnType<typeof store.getState>) => T,
  callback: (selectedState: T) => void
) => {
  let lastState = selector(store.getState());

  return store.subscribe(() => {
    const newState = selector(store.getState());
    if (newState !== lastState) {
      lastState = newState;
      callback(newState);
    }
  });
};

export const getCurrentState = <T>(selector: (state: RootState) => T): T => {
  const newState = { value: selector(store.getState()) };

  store.subscribe(() => {
    newState.value = selector(store.getState());
  });

  return newState.value;
};

export const dispatch = store.dispatch;

export default store;
