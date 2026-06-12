import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Explore from "./pages/Explore";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
