import { BrowserRouter, Routes, Route } from "react-router";
import { 
  LoginPage, 
  DashboardPage, 
  IncidentPage, 
  ReportPage, 
  UserPage
} from "@/pages";
import { ProtectedRoute } from '@/components/templates'
import { useTheme } from "@/utils/useTheme";


function App() {
  useTheme();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/incidents" element={<IncidentPage />} />
          <Route path="/reports" element={<ReportPage />} />
          <Route path="/users" element={<UserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
