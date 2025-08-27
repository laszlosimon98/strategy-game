import GamePage from "@/src/features/gamepage/game-page";
import Login from "@/src/features/pages/auth/Login";
import Register from "@/src/features/pages/auth/Register";
import Description from "@/src/features/pages/description";
import Join from "@/src/features/pages/Join";
import Lobby from "@/src/features/pages/Lobby";
import MainPage from "@/src/features/pages/main-page";
import NewGame from "@/src/features/pages/new-game";
import Statistic from "@/src/features/pages/Statistic";
import { ReactElement, useEffect } from "react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";

const App = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  }, []);

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
