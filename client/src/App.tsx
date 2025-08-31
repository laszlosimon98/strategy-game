import Description from "@/components/views/other/Description";
import GamePage from "@/components/views/GamePage";
import JoinGame from "@/components/views/JoinGame";
import Lobby from "@/components/views/Lobby";
import Login from "@/components/views/auth/Login";
import MainPage from "@/components/views/MainPage";
import NewGame from "@/components/views/NewGame";
import Register from "@/components/views/auth/Register";
import Statistic from "@/components/views/other/Statistic";
import { useEffect } from "react";
import { useNavigate, useLocation, Route, Routes } from "react-router-dom";

const App = () => {
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

      <Route path="new-game" element={<NewGame />} />
      <Route path="join-game" element={<JoinGame />} />
      <Route path="lobby" element={<Lobby />} />

      <Route path="game" element={<GamePage />} />
    </Routes>
  );
};

export default App;
