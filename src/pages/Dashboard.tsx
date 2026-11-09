import { Logo } from "../components/Logo";
import { Icon } from "../components/Icon";
import { getSession, clearSession } from "../lib/auth";
import { navigate } from "../lib/router";

// Placeholder: replace with the real dashboard once the Spring Boot order APIs exist.
export default function Dashboard() {
  const user = getSession()?.user;
  const name = user?.fullName?.split(" ")[0] || user?.email || "there";

  function logout() {
    clearSession();
    navigate("/login", { replace: true });
  }

  return (
    <>
      <header className="nav">
        <div className="container nav__inner">
          <Logo />
          <div className="nav__actions">
            <span className="nav__user">{user?.email}</span>
            <button className="btn btn--ghost" onClick={logout}>
              <Icon name="logout" size={18} /> Log out
            </button>
          </div>
        </div>
      </header>
      <main className="container dash">
        <h1>Hi {name} 👋</h1>
        <p className="lead">You're logged in. The dashboard goes here.</p>
        <div className="dash__empty">
          <Icon name="box" size={28} />
          <p>No orders yet. Connect the order endpoints to show them here.</p>
        </div>
      </main>
    </>
  );
}
