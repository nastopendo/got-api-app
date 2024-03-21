import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CharactersTable from "./pages/Characters";
import HouseDetails from "./pages/HouseDetails";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CharactersTable />} />
        <Route path="/house/:id" element={<HouseDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
