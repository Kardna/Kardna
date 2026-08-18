import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { CommandPalette } from "./components/CommandPalette";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { PageLoader } from "./components/PageLoader";
import { ScrollToTop } from "./components/ScrollToTop";
import { ThemeController } from "./components/ThemeController";
import { ProfileProvider } from "./context/ProfileContext";

const HomePage = lazy(() => import("./pages/HomePage").then((module) => ({ default: module.HomePage })));
const GamesPage = lazy(() => import("./pages/GamesPage").then((module) => ({ default: module.GamesPage })));
const PlayPage = lazy(() => import("./pages/PlayPage").then((module) => ({ default: module.PlayPage })));
const MixPage = lazy(() => import("./pages/MixPage").then((module) => ({ default: module.MixPage })));
const ProxyPage = lazy(() => import("./pages/ProxyPage").then((module) => ({ default: module.ProxyPage })));
const SettingsPage = lazy(() => import("./pages/SettingsPage").then((module) => ({ default: module.SettingsPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })));

function AppShell() {
  const location = useLocation();
  const hideChrome = location.pathname.startsWith("/play/") && document.fullscreenElement;

  return (
    <>
      <ThemeController />
      <ScrollToTop />
      {!hideChrome && <Navbar />}
      <CommandPalette />
      <div className="route-shell">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<GamesPage />} />
            <Route path="/play/:id" element={<PlayPage />} />
            <Route path="/mix" element={<MixPage />} />
            <Route path="/proxy" element={<ProxyPage />} />
            <Route path="/browse" element={<ProxyPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
      {!hideChrome && <Footer />}
    </>
  );
}

export default function App() {
  return <ProfileProvider><AppShell /></ProfileProvider>;
}
