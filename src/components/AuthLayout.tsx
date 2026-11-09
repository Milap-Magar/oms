import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Logo } from "./Logo";
import { Icon } from "./Icon";

export function AuthLayout({ title, subtitle, children, footer }: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="auth">
      <div className="auth__main">
        <div className="auth__top"><Logo /></div>
        <div className="auth__card">
          <h1>{title}</h1>
          <p className="auth__sub">{subtitle}</p>
          {children}
          <p className="auth__switch">{footer}</p>
        </div>
      </div>
      <aside className="auth__side" aria-hidden="true">
        <div className="auth__side-inner">
          <p className="auth__quote">Every order in one place. Know what's pending, packed and shipped, at a glance.</p>
          <div className="auth__mini">
            {[
              ["#1048", "pending"],
              ["#1047", "packed"],
              ["#1046", "shipped"],
              ["#1045", "delivered"],
            ].map(([id, s]) => (
              <div className="auth__mini-row" key={id}>
                <span className="mono">{id}</span>
                <span className={`pill pill--${s}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
};

export function Field({ label, name, error, hint, optional, type = "text", ...input }: FieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const id = `f-${name}`;
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;

  return (
    <div className={"field" + (error ? " field--error" : "")}>
      <label htmlFor={id}>
        {label} {optional && <span className="field__opt">(optional)</span>}
      </label>
      <div className="field__control">
        <input
          id={id}
          name={name}
          type={isPassword && show ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          {...input}
        />
        {isPassword && (
          <button type="button" className="field__toggle" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
            <Icon name={show ? "eyeOff" : "eye"} size={18} />
          </button>
        )}
      </div>
      {error ? (
        <p className="field__error" id={`${id}-err`}>{error}</p>
      ) : hint ? (
        <p className="field__hint" id={`${id}-hint`}>{hint}</p>
      ) : null}
    </div>
  );
}

export function FormAlert({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="alert" role="alert">
      <Icon name="alert" size={18} />
      <span>{message}</span>
    </div>
  );
}
