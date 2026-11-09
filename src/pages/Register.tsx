import { useState, type ChangeEvent, type FormEvent } from "react";
import { AuthLayout, Field, FormAlert } from "../components/AuthLayout";
import { Link, navigate } from "../lib/router";
import { authApi, ApiError } from "../lib/api";
import { saveSession } from "../lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function strength(pw: string): { score: number; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return { score, label: ["Too short", "Weak", "Okay", "Good", "Strong"][score]! };
}

export default function Register() {
  const [form, setForm] = useState({ fullName: "", companyName: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const pw = strength(form.password);

  function validate() {
    const errs: Record<string, string> = {};
    if (form.fullName.trim().length < 2) errs.fullName = "Enter your name.";
    if (!EMAIL_RE.test(form.email.trim())) errs.email = "Enter a valid email address.";
    if (form.password.length < 8) errs.password = "Use at least 8 characters.";
    if (form.confirm !== form.password) errs.confirm = "Passwords don't match.";
    return errs;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setFormError("");
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const session = await authApi.register({
        fullName: form.fullName.trim(),
        companyName: form.companyName.trim() || undefined,
        email: form.email.trim(),
        password: form.password,
      });
      saveSession(session, true);
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
      title="Create your account"
      subtitle="Start managing your orders in minutes."
      footer={<>Already have an account? <Link to="/login">Log in</Link></>}
    >
      <form onSubmit={onSubmit} noValidate className="form">
        <FormAlert message={formError} />
        <div className="form__row">
          <Field label="Full name" name="fullName" autoComplete="name" autoFocus placeholder="Jane Doe"
            value={form.fullName} onChange={set("fullName")} error={errors.fullName} />
          <Field label="Company" name="companyName" autoComplete="organization" placeholder="Acme Store" optional
            value={form.companyName} onChange={set("companyName")} error={errors.companyName} />
        </div>
        <Field label="Work email" name="email" type="email" autoComplete="email" placeholder="you@company.com"
          value={form.email} onChange={set("email")} error={errors.email} />
        <Field
          label="Password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters"
          value={form.password} onChange={set("password")} error={errors.password}
          hint={form.password && (
            <span className="meter" data-score={pw.score}>
              <span className="meter__bars"><i /><i /><i /><i /></span>
              {pw.label}
            </span>
          )}
        />
        <Field label="Confirm password" name="confirm" type="password" autoComplete="new-password" placeholder="Type it again"
          value={form.confirm} onChange={set("confirm")} error={errors.confirm} />
        <button className="btn btn--primary btn--block btn--lg" disabled={loading}>
          {loading ? <span className="spinner" aria-label="Creating account" /> : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
