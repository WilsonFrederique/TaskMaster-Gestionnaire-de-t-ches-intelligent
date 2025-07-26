import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import Home from "./assets/pages/Home/Home";
import Parametres from "./assets/pages/Parametres/Parametres";
import Categorie from "./assets/pages/Categorie/Categorie";
import Tache from "./assets/pages/Tache/Tache";
import SousTache from "./assets/pages/SousTache/SousTache";

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorie" element={<Categorie />} />
          <Route path="/tache" element={<Tache />} />
          <Route path="/sousTache" element={<SousTache />} />
          <Route path="/parametres" element={<Parametres />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App