import { BrowserRouter, Routes, Route } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { useTheme } from "./utils/useTheme";
import { ThemeToggle } from "./components/atoms/ThemeToggle";

function App() {
  useTheme();

  return (
    <BrowserRouter>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
