import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { AuthGate } from "@/components/AuthGate";
import { Dashboard } from "@/pages/Dashboard";
import { Health } from "@/pages/Health";
import { Learning } from "@/pages/Learning";
import { Nutrition } from "@/pages/Nutrition";
import { Reading } from "@/pages/Reading";
import { Reflections } from "@/pages/Reflections";

function App() {
  return (
    <AuthGate>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="learning" element={<Learning />} />
            <Route path="reading" element={<Reading />} />
            <Route path="nutrition" element={<Nutrition />} />
            <Route path="health" element={<Health />} />
            <Route path="reflections" element={<Reflections />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthGate>
  );
}

export default App;
