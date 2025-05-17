
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import { AppProvider } from "@/contexts/AppContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import RitualOfTheDay from "./pages/RitualOfTheDay";
import MyForest from "./pages/MyForest";
import Meditation from "./pages/Meditation";
import EmotionDiary from "./pages/EmotionDiary";
import Planner from "./pages/Planner";
import MessageFromCelia from "./pages/MessageFromCelia";
import Shop from "./pages/Shop";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import RequireAuth from "./components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<RequireAuth><PrivateLayout /></RequireAuth>}>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/ritual" element={<RitualOfTheDay />} />
                <Route path="/my-forest" element={<MyForest />} />
                <Route path="/meditation" element={<Meditation />} />
                <Route path="/diary" element={<EmotionDiary />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/message" element={<MessageFromCelia />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/settings" element={<AccountSettings />} />
              </Route>

              {/* Redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
