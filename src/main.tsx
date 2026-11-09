import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { usePath, navigate } from "./lib/router";
import { getSession } from "./lib/auth";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const TITLES: Record<string, string> = {
  "/": "Ordiva | Simple order management",
  "/login": "Log in | Ordiva",
  "/register": "Create account | Ordiva",
  "/dashboard": "Dashboard | Ordiva",
};

function Redirect({ to }: { to: string }) {
  useEffect(() => navigate(to, { replace: true }), [to]);
  return null;
}

function App() {
  const path = usePath().replace(/\/+$/, "") || "/";
  const loggedIn = !!getSession();

  useEffect(() => {
    document.title = TITLES[path] ?? "Page not found | Ordiva";
  }, [path]);

  switch (path) {
    case "/":
      return <Landing />;
    case "/login":
      return loggedIn ? <Redirect to="/dashboard" /> : <Login />;
    case "/register":
      return loggedIn ? <Redirect to="/dashboard" /> : <Register />;
    case "/dashboard":
      return loggedIn ? <Dashboard /> : <Redirect to="/login" />;
    default:
      return <NotFound />;
  }
}

createRoot(document.getElementById("root")!).render(<App />);
