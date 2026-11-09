import { Link } from "../lib/router";
import { Logo } from "../components/Logo";

export default function NotFound() {
  return (
    <main className="notfound">
      <Logo />
      <h1>Page not found</h1>
      <p>This page doesn't exist or was moved.</p>
      <Link to="/" className="btn btn--primary">Back to home</Link>
    </main>
  );
}
