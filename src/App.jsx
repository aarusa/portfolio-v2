import { BrowserRouter, HashRouter, Navigate, Route, Routes, useParams } from "react-router-dom";
import { ChatProvider } from "./components/Chat";
import { Layout } from "./components/Layout";
import { ClonePage } from "./pages/ClonePage";
import { Home } from "./pages/Home";
import { Lab } from "./pages/Lab";
import { LabPage } from "./pages/LabPage";
import { LabPlayPage } from "./pages/LabPlayPage";
import { NotFound } from "./pages/NotFound";
import { PostPage } from "./pages/PostPage";
import { ProjectPage } from "./pages/ProjectPage";
import { ProjectsIndex } from "./pages/ProjectsIndex";
import { Writing } from "./pages/Writing";

function BlogRedirect() {
  const { slug } = useParams();
  return <Navigate to={slug ? `/blog/${slug}` : "/blog"} replace />;
}

function AppRoutes() {
  return (
    <ChatProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="projects" element={<ProjectsIndex />} />
          <Route path="projects/:slug" element={<ProjectPage />} />
          <Route path="blog" element={<Writing />} />
          <Route path="blog/:slug" element={<PostPage />} />
          <Route path="writing" element={<BlogRedirect />} />
          <Route path="writing/:slug" element={<BlogRedirect />} />
          <Route path="lab" element={<Lab />} />
          <Route path="lab/:slug/play" element={<LabPlayPage />} />
          <Route path="lab/:slug" element={<LabPage />} />
          <Route path="clone" element={<ClonePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ChatProvider>
  );
}

export default function App() {
  // Local inlined builds open as file:// or from ./dist — HashRouter is required there.
  // GitHub Pages / arusha.com.np uses BrowserRouter with clean URLs.
  const local = import.meta.env.BASE_URL === "./";
  const Router = local ? HashRouter : BrowserRouter;

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
