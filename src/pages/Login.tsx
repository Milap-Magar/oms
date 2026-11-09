import { useState, type FormEvent } from "react";
import { AuthLayout, Field, FormAlert } from "../components/AuthLayout";
import { Link, navigate } from "../lib/router";
import { authApi, ApiError } from "../lib/api";
import { saveSession } from "../lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!EMAIL_RE.test(email.trim())) errs.email = "Enter a valid email address.";
    if (!password) errs.password = "Enter your password.";
    setErrors(errs);
    setFormError("");
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const session = await authApi.login({ email: email.trim(), password });
      saveSession(session, remember);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fieldErrors);
        setFormError(err.message);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to see your orders."
      footer={<>New to Ordiva? <Link to="/register">Create an account</Link></>}
    >
      <form onSubmit={onSubmit} noValidate className="form">
        <FormAlert message={formError} />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <label className="check">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          Keep me logged in
        </label>
        <button className="btn btn--primary btn--block btn--lg" disabled={loading}>
          {loading ? <span className="spinner" aria-label="Logging in" /> : "Log in"}
        </button>
      </form>
    </AuthLayout>
  );
}
