import Description from "@/view/pages/Description";
import GamePage from "@/view/gamepage/GamePage";
import Join from "@/view/pages/Join";
import Lobby from "@/view/pages/Lobby";
import Login from "@/view/pages/auth/Login";
import MainPage from "@/view/pages/MainPage";
import NewGame from "@/view/pages/NewGame";
import Register from "@/view/pages/auth/Register";
import Statistic from "@/view/pages/Statistic";
import { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

const App = (): ReactElement => {
  return (
    <Routes>
      <Route index element={<MainPage />} />

      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      <Route path="description" element={<Description />} />
      <Route path="statistic" element={<Statistic />} />

      <Route path="newgame" element={<NewGame />} />
      <Route path="join" element={<Join />} />
      <Route path="lobby" element={<Lobby />} />

      <Route path="game" element={<GamePage />} />
    </Routes>
  );
};

export default App;
