import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Reservas from "../pages/Reservas";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reservas" element={<Reservas />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;