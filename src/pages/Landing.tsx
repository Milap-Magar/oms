import { Link } from "../lib/router";
import { getSession } from "../lib/auth";
import { Logo } from "../components/Logo";
import { Icon } from "../components/Icon";

const FEATURES = [
  { icon: "box", title: "Every order in one list", text: "Add orders in seconds and see them all in one place, newest first." },
  { icon: "pulse", title: "Status at a glance", text: "Placed, packed, shipped, delivered. Colour-coded, so you know where each order is." },
  { icon: "users", title: "Customer records", text: "Contact details and order history for every customer, one click away." },
  { icon: "stack", title: "Stock that stays right", text: "Product stock goes down as orders come in. Get a heads-up before you run out." },
  { icon: "search", title: "Find anything fast", text: "Search by order number, customer or product. Filter by status or date." },
  { icon: "shield", title: "Team access", text: "Invite your team and choose who can view, edit or manage orders." },
];

const FLOW = ["Placed", "Confirmed", "Packed", "Shipped", "Delivered"];

const PREVIEW_ORDERS = [
  { id: "#1048", customer: "Sara Malik", items: 3, total: "$128.00", status: "pending" },
  { id: "#1047", customer: "Leo Brandt", items: 1, total: "$42.50", status: "packed" },
  { id: "#1046", customer: "Ana Costa", items: 5, total: "$310.20", status: "shipped" },
  { id: "#1045", customer: "Omar Haddad", items: 2, total: "$76.00", status: "delivered" },
];

export default function Landing() {
  const loggedIn = !!getSession();

  return (
    <>
      <header className="nav">
        <div className="container nav__inner">
          <Logo />
          <nav className="nav__links" aria-label="Main">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
          </nav>
          <div className="nav__actions">
            {loggedIn ? (
              <Link to="/dashboard" className="btn btn--primary">Open dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn--ghost">Log in</Link>
                <Link to="/register" className="btn btn--primary">Get started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero__grid">
            <div className="hero__copy">
              <span className="eyebrow">Order management, made simple</span>
              <h1>Every order, from placed to delivered.</h1>
              <p className="lead">
                Ordiva keeps your orders, customers and stock in one clear place,
                so nothing slips through the cracks.
              </p>
              <div className="hero__cta">
                <Link to="/register" className="btn btn--primary btn--lg">
                  Create your account <Icon name="arrow" size={18} />
                </Link>
                <Link to="/login" className="btn btn--outline btn--lg">Log in</Link>
              </div>
              <ul className="hero__points">
                <li><Icon name="check" size={16} /> Set up in minutes</li>
                <li><Icon name="check" size={16} /> Works on any device</li>
              </ul>
            </div>

            <div className="preview" aria-label="Preview of the Ordiva dashboard">
              <div className="preview__bar"><span /><span /><span /></div>
              <div className="preview__body">
                <div className="preview__stats">
                  <Stat label="Today" value="128" />
                  <Stat label="Pending" value="14" tone="pending" />
                  <Stat label="Shipped" value="96" tone="shipped" />
                </div>
                <div className="preview__table">
                  <div className="preview__head">
                    <span>Order</span><span>Customer</span><span className="hide-sm">Items</span><span>Total</span><span>Status</span>
                  </div>
                  {PREVIEW_ORDERS.map((o) => (
                    <div className="preview__row" key={o.id}>
                      <span className="mono">{o.id}</span>
                      <span>{o.customer}</span>
                      <span className="hide-sm">{o.items}</span>
                      <span className="mono">{o.total}</span>
                      <span><span className={`pill pill--${o.status}`}>{o.status}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section">
          <div className="container">
            <div className="section__head">
              <h2>Everything you need. Nothing you don't.</h2>
              <p>The everyday tools for running orders, without the clutter of big enterprise software.</p>
            </div>
            <div className="features">
              {FEATURES.map((f) => (
                <article className="feature" key={f.title}>
                  <div className="feature__icon"><Icon name={f.icon} size={22} /></div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how" className="section section--tint">
          <div className="container">
            <div className="section__head">
              <h2>One clear path for every order</h2>
              <p>Each order moves through the same simple steps. You always know what's next.</p>
            </div>
            <ol className="flow">
              {FLOW.map((step, i) => (
                <li key={step} className="flow__step">
                  <span className="flow__dot">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>

            <div className="steps">
              <Step n={1} title="Create your account" text="Sign up with your email. No setup calls, no long forms." />
              <Step n={2} title="Add your orders" text="Enter orders as they come in, with customer and product details." />
              <Step n={3} title="Track and ship" text="Move orders through each step and see the whole picture on your dashboard." />
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="cta">
              <div>
                <h2>Ready to get your orders in order?</h2>
                <p>Create an account and add your first order in under a minute.</p>
              </div>
              <Link to="/register" className="btn btn--light btn--lg">
                Get started <Icon name="arrow" size={18} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <Logo />
          <p>© {new Date().getFullYear()} Ordiva. Simple order management.</p>
          <div className="footer__links">
            <Link to="/login">Log in</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </footer>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className={"stat" + (tone ? ` stat--${tone}` : "")}>
      <span className="stat__label">{label}</span>
      <span className="stat__value">{value}</span>
    </div>
  );
}

function Step({ n, title, text }: { n: number; title: string; text: string }) {
  return (
    <div className="step">
      <span className="step__n">{n}</span>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
