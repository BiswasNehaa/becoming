import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { Dashboard } from "@/pages/Dashboard";
import { Hobbies } from "@/pages/Hobbies";
import { Learning } from "@/pages/Learning";
import { Nutrition } from "@/pages/Nutrition";
import { Reading } from "@/pages/Reading";
import { Reflections } from "@/pages/Reflections";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="learning" element={<Learning />} />
          <Route path="reading" element={<Reading />} />
          <Route path="hobbies" element={<Hobbies />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="reflections" element={<Reflections />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
