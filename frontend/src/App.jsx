import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Compass,
  GraduationCap,
  Lightbulb,
  LockKeyhole,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  Users,
} from "lucide-react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { assessmentQuestions, careers, resources } from "./data/mockData";
import "./styles.css";

function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  );
}

function SectionHeading({ title, subtitle, action }) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, detail, tone = "blue" }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={20} />
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-detail">{detail}</div>
    </div>
  );
}

function ProgressBar({ value, color = "blue" }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${value}% complete`}
    >
      <div
        className={`progress-fill ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function CareerCard({ career, rank }) {
  return (
    <article className="career-card">
      <div className="career-card-top">
        <div className="career-icon">
          <BriefcaseBusiness size={21} />
        </div>
        <span className="match-pill">{career.match}% match</span>
      </div>
      <div className="career-rank">
        RECOMMENDATION {String(rank).padStart(2, "0")}
      </div>
      <h3>{career.title}</h3>
      <div className="career-category">{career.category}</div>
      <p>{career.description}</p>
      <div className="match-track">
        <ProgressBar value={career.match} />
      </div>
      <Link className="text-link" to={`/app/careers/${career.slug}`}>
        Explore career <ArrowRight size={15} />
      </Link>
    </article>
  );
}

function LandingPage() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Link to="/" className="brand landing-brand">
          <div className="brand-mark">
            <Compass size={23} />
          </div>
          <div>
            <strong>Career Navigator</strong>
            <span>Find your direction</span>
          </div>
        </Link>
        <nav className="landing-nav-links" aria-label="Public navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#features">Features</a>
          <Link to="/login" className="nav-login">
            Log in
          </Link>
          <Link to="/register" className="button button-primary button-small">
            Get started <ArrowRight size={16} />
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="hero-kicker">
            <Sparkles size={15} /> YOUR FUTURE, WITH MORE CLARITY
          </div>
          <h1>
            Your career journey starts with <span>understanding you.</span>
          </h1>
          <p>
            Discover career paths that fit your interests, strengths, and
            aspirations — then turn your next steps into a practical plan.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="button button-primary">
              Explore your path <ArrowRight size={17} />
            </Link>
            <a href="#how-it-works" className="button button-secondary">
              See how it works
            </a>
          </div>
          <div className="hero-trust">
            <span>
              <CheckCircle2 size={16} /> Personalized guidance
            </span>
            <span>
              <CheckCircle2 size={16} /> Actionable roadmaps
            </span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-center">
            <div className="hero-center-icon">
              <Compass size={37} />
            </div>
            <span>YOUR CAREER MAP</span>
            <strong>Find your fit.</strong>
            <small>One step at a time.</small>
          </div>
          <div className="floating-card floating-card-top">
            <span className="floating-icon mint">
              <Target size={18} />
            </span>
            <div>
              <strong>Know your strengths</strong>
              <small>Start with self-discovery</small>
            </div>
          </div>
          <div className="floating-card floating-card-bottom">
            <span className="floating-icon blue">
              <TrendingUp size={18} />
            </span>
            <div>
              <strong>Build your roadmap</strong>
              <small>Turn goals into actions</small>
            </div>
          </div>
          <div className="hero-spark spark-one">✳</div>
          <div className="hero-spark spark-two">✦</div>
        </div>
      </section>

      <section className="landing-metrics">
        <div>
          <strong>01</strong>
          <span>Understand your strengths</span>
        </div>
        <div>
          <strong>02</strong>
          <span>Explore relevant careers</span>
        </div>
        <div>
          <strong>03</strong>
          <span>Plan your next steps</span>
        </div>
      </section>

      <section className="landing-section" id="how-it-works">
        <div className="centered-heading">
          <div className="eyebrow">A CLEARER WAY FORWARD</div>
          <h2>From questions to a plan</h2>
          <p>
            A simple workflow designed to help you explore options and make
            informed decisions.
          </p>
        </div>
        <div className="steps-grid">
          {[
            {
              n: "01",
              icon: UserRound,
              title: "Understand yourself",
              text: "Reflect on your aptitude, interests, and academic strengths.",
            },
            {
              n: "02",
              icon: Sparkles,
              title: "Explore your matches",
              text: "Review ranked career suggestions and why each could fit.",
            },
            {
              n: "03",
              icon: BookOpen,
              title: "Build your roadmap",
              text: "Turn a career idea into skills, resources, and achievable milestones.",
            },
          ].map((step) => (
            <article className="step-card" key={step.n}>
              <div className="step-top">
                <span>{step.n}</span>
                <step.icon size={22} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-section feature-section" id="features">
        <div className="centered-heading">
          <div className="eyebrow">BUILT AROUND YOUR JOURNEY</div>
          <h2>More than a list of careers</h2>
          <p>
            Bring exploration, planning, and progress together in one place.
          </p>
        </div>
        <div className="feature-grid">
          <div className="feature-item">
            <div className="feature-icon">
              <Target size={21} />
            </div>
            <h3>Multi-factor assessment</h3>
            <p>
              Consider aptitude, interests, and academic strengths together.
            </p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <BriefcaseBusiness size={21} />
            </div>
            <h3>Career recommendations</h3>
            <p>Explore options with understandable match explanations.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <BookOpen size={21} />
            </div>
            <h3>Practical roadmaps</h3>
            <p>See the skills, learning topics, and milestones to work on.</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <BarChart3 size={21} />
            </div>
            <h3>Progress tracking</h3>
            <p>Review your learning activity and keep moving forward.</p>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <div>
          <div className="eyebrow">YOUR NEXT CHAPTER</div>
          <h2>Make your next step a little clearer.</h2>
          <p>Start exploring your interests and possible career directions.</p>
        </div>
        <Link to="/register" className="button button-light">
          Get started <ArrowRight size={17} />
        </Link>
      </section>

      <footer className="landing-footer">
        <Link to="/" className="brand landing-brand">
          <div className="brand-mark">
            <Compass size={21} />
          </div>
          <div>
            <strong>Career Navigator</strong>
            <span>Find your direction</span>
          </div>
        </Link>
        <p>
          Career guidance is a starting point, not a guarantee. Explore,
          reflect, and make informed decisions.
        </p>
      </footer>
    </div>
  );
}

function AuthPage({ register = false }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function update(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function submit(event) {
    event.preventDefault();
    setError("");

    if (register && form.name.trim().length < 2) {
      setError("Enter your name to continue.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Use at least 8 characters for this demo password.");
      return;
    }

    navigate("/app/dashboard");
  }

  return (
    <div className="auth-page">
      <Link to="/" className="brand auth-brand">
        <div className="brand-mark">
          <Compass size={23} />
        </div>
        <div>
          <strong>Career Navigator</strong>
          <span>Find your direction</span>
        </div>
      </Link>
      <div className="auth-card">
        <div className="auth-icon">
          <Compass size={24} />
        </div>
        <div className="eyebrow">
          {register ? "START YOUR JOURNEY" : "WELCOME BACK"}
        </div>
        <h1>{register ? "Create your account" : "Welcome back"}</h1>
        <p>
          {register
            ? "Set up your demo profile to explore the experience."
            : "Sign in to continue exploring your career journey."}
        </p>

        <div className="demo-notice">
          <ShieldCheck size={17} />
          <span>
            Prototype mode: this form does not create or authenticate a real
            account.
          </span>
        </div>

        <form className="form-stack" onSubmit={submit}>
          {register && (
            <label className="field-label">
              Full name
              <span className="field-wrap">
                <UserRound size={17} />
                <input
                  name="name"
                  value={form.name}
                  onChange={update}
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </span>
            </label>
          )}
          <label className="field-label">
            Email address
            <span className="field-wrap">
              <Mail size={17} />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={update}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </span>
          </label>
          <label className="field-label">
            Password
            <span className="field-wrap">
              <LockKeyhole size={17} />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={update}
                placeholder="At least 8 characters"
                autoComplete={register ? "new-password" : "current-password"}
                minLength={8}
                required
              />
            </span>
          </label>
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <button className="button button-primary button-full" type="submit">
            {register ? "Create demo profile" : "Enter demo workspace"}{" "}
            <ArrowRight size={17} />
          </button>
        </form>
        <div className="auth-switch">
          {register ? "Already have an account?" : "New to Career Navigator?"}{" "}
          <Link to={register ? "/login" : "/register"}>
            {register ? "Log in" : "Create an account"}
          </Link>
        </div>
      </div>
      <p className="auth-footnote">
        Your future is yours to shape. Use recommendations as a starting point
        for exploration.
      </p>
    </div>
  );
}

function Dashboard() {
  return (
    <>
      <PageHeader
        eyebrow="STUDENT DASHBOARD"
        title="Your journey, one step at a time."
        description="Welcome back! Here’s your current career exploration snapshot."
        action={
          <Link to="/app/assessment" className="button button-primary">
            <ClipboardIcon /> Start assessment
          </Link>
        }
      />
      <div className="welcome-banner">
        <div className="welcome-copy">
          <span className="welcome-kicker">
            <Sparkles size={15} /> YOUR CAREER JOURNEY
          </span>
          <h2>Small steps create meaningful progress.</h2>
          <p>
            Complete your assessment to explore career directions tailored to
            your responses.
          </p>
          <Link to="/app/assessment" className="button button-light">
            Continue your journey <ArrowRight size={16} />
          </Link>
        </div>
        <div className="welcome-art">
          <div className="welcome-art-circle">
            <Compass size={55} />
          </div>
          <span className="welcome-orbit-dot dot-a" />
          <span className="welcome-orbit-dot dot-b" />
          <span className="welcome-orbit-dot dot-c" />
        </div>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={Target}
          label="Assessment status"
          value="Not completed"
          detail="5 demo questions available"
          tone="blue"
        />
        <StatCard
          icon={Sparkles}
          label="Career matches"
          value="5 options"
          detail="Illustrative sample recommendations"
          tone="mint"
        />
        <StatCard
          icon={BookOpen}
          label="Roadmap progress"
          value="20%"
          detail="1 of 5 demo milestones"
          tone="purple"
        />
        <StatCard
          icon={Award}
          label="Learning activity"
          value="2 hours"
          detail="Sample activity, not tracked time"
          tone="orange"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel recommendation-panel">
          <SectionHeading
            title="Explore your career matches"
            subtitle="A preview of possible directions"
            action={
              <Link className="text-link" to="/app/recommendations/latest">
                View all <ArrowRight size={15} />
              </Link>
            }
          />
          <div className="mini-career-list">
            {careers.slice(0, 3).map((career, index) => (
              <div className="mini-career" key={career.slug}>
                <div className={`mini-career-icon mini-tone-${index}`}>
                  <BriefcaseBusiness size={19} />
                </div>
                <div className="mini-career-info">
                  <strong>{career.title}</strong>
                  <span>{career.category}</span>
                </div>
                <div className="mini-match">
                  {career.match}%<small>sample</small>
                </div>
                <Link
                  className="mini-arrow"
                  to={`/app/careers/${career.slug}`}
                  aria-label={`Explore ${career.title}`}
                >
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            ))}
          </div>
          <p className="data-disclaimer">
            These scores are illustrative demo values, not model-generated
            predictions.
          </p>
        </section>

        <section className="panel progress-panel">
          <SectionHeading
            title="Your roadmap"
            subtitle="A sample learning plan"
          />
          <div className="roadmap-progress">
            <div className="roadmap-progress-top">
              <span>Getting started</span>
              <strong>20%</strong>
            </div>
            <ProgressBar value={20} color="mint" />
            <p>One milestone is marked complete in this preview.</p>
          </div>
          {[
            "Explore your interests",
            "Choose a career direction",
            "Build foundational skills",
          ].map((item, index) => (
            <div className="task-row" key={item}>
              <span className={`task-check${index === 0 ? " checked" : ""}`}>
                {index === 0 && <Check size={13} />}
              </span>
              <span>{item}</span>
              {index === 0 && <small>Done</small>}
            </div>
          ))}
          <Link className="text-link roadmap-link" to="/app/roadmap">
            Open roadmap <ArrowRight size={15} />
          </Link>
        </section>
      </div>

      <section className="panel quick-actions-panel">
        <SectionHeading
          title="A good next step"
          subtitle="Pick one small action to move forward."
        />
        <div className="quick-actions">
          <Link to="/app/assessment" className="quick-action">
            <span className="quick-icon blue">
              <ClipboardIcon />
            </span>
            <span>
              <strong>Complete your assessment</strong>
              <small>Reflect on your strengths and interests.</small>
            </span>
            <ChevronRight size={18} />
          </Link>
          <Link to="/app/careers" className="quick-action">
            <span className="quick-icon mint">
              <BriefcaseBusiness size={19} />
            </span>
            <span>
              <strong>Explore career paths</strong>
              <small>Compare responsibilities and required skills.</small>
            </span>
            <ChevronRight size={18} />
          </Link>
          <Link to="/app/profile" className="quick-action">
            <span className="quick-icon purple">
              <UserRound size={19} />
            </span>
            <span>
              <strong>Review your profile</strong>
              <small>Keep your academic details up to date.</small>
            </span>
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}

function ClipboardIcon() {
  return <ClipboardCheckIcon />;
}

function ClipboardCheckIcon() {
  return <CheckCircle2 size={17} />;
}

function Assessment() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState("");
  const question = assessmentQuestions[current];
  const answered = Object.keys(answers).length;
  const percent = Math.round((answered / assessmentQuestions.length) * 100);

  function choose(optionIndex) {
    setAnswers((previous) => ({ ...previous, [question.id]: optionIndex }));
    setError("");
  }

  function next() {
    if (answers[question.id] === undefined) {
      setError("Choose an answer before continuing.");
      return;
    }
    if (current < assessmentQuestions.length - 1) {
      setCurrent((value) => value + 1);
    } else {
      navigate("/app/recommendations/latest");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="SELF-DISCOVERY"
        title="Career assessment"
        description="A short demo assessment covering aptitude, interests, and academic strengths."
      />
      <div className="assessment-layout">
        <section className="panel assessment-card">
          <div className="assessment-topline">
            <span>
              QUESTION {current + 1} OF {assessmentQuestions.length}
            </span>
            <span>{percent}% answered</span>
          </div>
          <ProgressBar
            value={((current + 1) / assessmentQuestions.length) * 100}
          />
          <div className="question-section">{question.section}</div>
          <h2 className="question-title">{question.question}</h2>
          <p className="question-hint">
            Choose the option that best describes you. There are no trick
            answers.
          </p>
          <div className="answer-list">
            {question.options.map((option, index) => {
              const selected = answers[question.id] === index;
              return (
                <button
                  key={option}
                  className={`answer-option${selected ? " selected" : ""}`}
                  onClick={() => choose(index)}
                  aria-pressed={selected}
                >
                  <span className="answer-letter">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                  {selected && (
                    <CheckCircle2 className="answer-selected-icon" size={19} />
                  )}
                </button>
              );
            })}
          </div>
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <div className="assessment-controls">
            <button
              className="button button-secondary"
              disabled={current === 0}
              onClick={() => setCurrent((value) => value - 1)}
            >
              Previous
            </button>
            <button className="button button-primary" onClick={next}>
              {current === assessmentQuestions.length - 1
                ? "View demo recommendations"
                : "Next question"}{" "}
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
        <aside className="panel assessment-aside">
          <div className="aside-icon">
            <Lightbulb size={21} />
          </div>
          <h3>Why this assessment?</h3>
          <p>
            Career decisions are personal. This prototype combines several areas
            of reflection rather than relying on one answer.
          </p>
          <div className="assessment-topic">
            <CheckCircle2 size={17} />
            <span>
              <strong>Aptitude</strong>
              <small>Logical, numerical, and verbal preferences</small>
            </span>
          </div>
          <div className="assessment-topic">
            <CheckCircle2 size={17} />
            <span>
              <strong>Interests</strong>
              <small>Activities and work environments you enjoy</small>
            </span>
          </div>
          <div className="assessment-topic">
            <CheckCircle2 size={17} />
            <span>
              <strong>Academic strengths</strong>
              <small>Areas where you feel confident</small>
            </span>
          </div>
          <div className="demo-notice aside-notice">
            <CircleHelp size={17} />
            <span>
              Demo answers are held only in this page's React state. Persistence
              will be implemented later.
            </span>
          </div>
        </aside>
      </div>
    </>
  );
}

function Recommendations() {
  const [sort, setSort] = useState("match");
  const sorted = useMemo(() => {
    const copy = [...careers];
    if (sort === "alphabetical")
      copy.sort((a, b) => a.title.localeCompare(b.title));
    else copy.sort((a, b) => b.match - a.match);
    return copy;
  }, [sort]);

  return (
    <>
      <PageHeader
        eyebrow="YOUR POSSIBLE DIRECTIONS"
        title="Career recommendations"
        description="Explore sample career options and the reasoning behind each suggestion."
        action={
          <Link className="button button-secondary" to="/app/assessment">
            Retake assessment
          </Link>
        }
      />
      <div className="demo-notice wide-notice">
        <Lightbulb size={18} />
        <span>
          <strong>Sample results:</strong> these rankings are fixed demo data
          and do not depend on your assessment answers yet.
        </span>
      </div>
      <div className="recommendation-summary panel">
        <div className="summary-emblem">
          <Sparkles size={24} />
        </div>
        <div>
          <strong>Your exploration shortlist</strong>
          <p>
            Use these examples to learn about different paths. A real score will
            be produced only after the assessment and recommendation service are
            integrated.
          </p>
        </div>
        <div className="summary-count">
          <strong>05</strong>
          <span>Sample careers</span>
        </div>
      </div>
      <div className="filter-row">
        <span>{sorted.length} career paths</span>
        <label className="sort-control">
          Sort by
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="match">Sample match score</option>
            <option value="alphabetical">Career name</option>
          </select>
        </label>
      </div>
      <div className="career-grid">
        {sorted.map((career, index) => (
          <CareerCard key={career.slug} career={career} rank={index + 1} />
        ))}
      </div>
    </>
  );
}

function Careers() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = [
    "All",
    ...new Set(careers.map((career) => career.category)),
  ];
  const filtered = careers.filter((career) => {
    const matchesQuery = `${career.title} ${
      career.description
    } ${career.skills.join(" ")}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesQuery && (category === "All" || career.category === category);
  });

  return (
    <>
      <PageHeader
        eyebrow="EXPLORE OPTIONS"
        title="Explore careers"
        description="Search career profiles, compare skills, and learn what each path involves."
      />
      <div className="career-toolbar panel">
        <label className="search-field">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search careers or skills..."
            aria-label="Search careers or skills"
          />
        </label>
        <label className="sort-control">
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      {filtered.length ? (
        <div className="career-grid">
          {filtered.map((career, index) => (
            <CareerCard key={career.slug} career={career} rank={index + 1} />
          ))}
        </div>
      ) : (
        <div className="panel empty-state">
          <Search size={25} />
          <h3>No careers found</h3>
          <p>Try another search or choose a different category.</p>
          <button
            className="button button-secondary"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}

function CareerDetail() {
  const { slug } = useParams();
  const career = careers.find((item) => item.slug === slug);

  if (!career) {
    return (
      <div className="panel empty-state">
        <h2>Career not found</h2>
        <Link className="text-link" to="/app/careers">
          Return to career directory <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="back-link">
        <Link to="/app/careers">← Back to careers</Link>
      </div>
      <div className="career-detail-hero">
        <div className="career-icon large">
          <BriefcaseBusiness size={27} />
        </div>
        <div className="career-detail-copy">
          <div className="eyebrow">{career.category.toUpperCase()}</div>
          <h1>{career.title}</h1>
          <p>{career.description}</p>
        </div>
        <div className="detail-match">
          <strong>{career.match}%</strong>
          <span>Illustrative match</span>
        </div>
      </div>
      <div className="detail-grid">
        <section className="panel">
          <SectionHeading
            title="Skills to explore"
            subtitle="Commonly useful areas for this career."
          />
          <div className="skill-list">
            {career.skills.map((skill) => (
              <span className="skill-tag" key={skill}>
                {skill}
              </span>
            ))}
          </div>
          <div className="detail-subsection">
            <h3>Qualifications and preparation</h3>
            <p>{career.qualifications}</p>
          </div>
          <div className="demo-notice">
            <CircleHelp size={17} />
            <span>
              Requirements vary by role, employer, and region. Verify details
              using current, reputable sources.
            </span>
          </div>
        </section>
        <section className="panel">
          <SectionHeading
            title="Suggested learning resources"
            subtitle="Starter topics for your exploration."
          />
          {resources.map((resource) => (
            <div className="resource-row" key={resource.title}>
              <span className="resource-icon">
                <BookOpen size={18} />
              </span>
              <div>
                <strong>{resource.title}</strong>
                <p>{resource.description}</p>
                <small>
                  {resource.type} · {resource.provider}
                </small>
              </div>
            </div>
          ))}
        </section>
      </div>
      <section className="panel detail-roadmap">
        <SectionHeading
          title="Suggested next steps"
          subtitle="A sample progression to help you get started."
          action={
            <Link className="text-link" to="/app/roadmap">
              Open roadmap <ArrowRight size={15} />
            </Link>
          }
        />
        {career.roadmap.map((step, index) => (
          <div className="timeline-row" key={step}>
            <span className="timeline-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{step}</span>
          </div>
        ))}
      </section>
    </>
  );
}

function Roadmap() {
  const [completed, setCompleted] = useState([0]);
  const steps = careers[0].roadmap;
  const percent = Math.round((completed.length / steps.length) * 100);

  function toggle(index) {
    setCompleted((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="YOUR ACTION PLAN"
        title="My roadmap"
        description="Track learning milestones as you explore a career direction."
      />
      <div className="roadmap-banner panel">
        <div className="roadmap-banner-icon">
          <Compass size={27} />
        </div>
        <div className="roadmap-banner-copy">
          <div className="eyebrow">SAMPLE ROADMAP</div>
          <h2>Software Developer</h2>
          <p>
            A starter plan for learning fundamentals and building practical
            experience.
          </p>
        </div>
        <div className="roadmap-banner-progress">
          <strong>{percent}%</strong>
          <span>complete</span>
          <ProgressBar value={percent} color="mint" />
        </div>
      </div>
      <section className="panel roadmap-list">
        <SectionHeading
          title="Milestones"
          subtitle={`${completed.length} of ${steps.length} marked complete in this session`}
        />
        {steps.map((step, index) => {
          const done = completed.includes(index);
          return (
            <button
              className={`milestone-row${done ? " milestone-done" : ""}`}
              key={step}
              onClick={() => toggle(index)}
              aria-pressed={done}
            >
              <span className={`milestone-check${done ? " checked" : ""}`}>
                {done && <Check size={15} />}
              </span>
              <span className="milestone-content">
                <strong>{step}</strong>
                <small>{done ? "Marked complete" : "Not completed yet"}</small>
              </span>
              <span className="milestone-step">STEP {index + 1}</span>
            </button>
          );
        })}
        <div className="demo-notice">
          <CircleHelp size={17} />
          <span>
            Milestone changes live in React state and reset on refresh. Saving
            progress is part of the backend phase.
          </span>
        </div>
      </section>
    </>
  );
}

function History() {
  return (
    <>
      <PageHeader
        eyebrow="YOUR ACTIVITY"
        title="Assessment history"
        description="Review previous assessment and recommendation activity."
      />
      <section className="panel table-panel">
        <SectionHeading
          title="Recent activity"
          subtitle="Illustrative entries for the interface prototype."
        />
        <div className="history-list">
          <div className="history-row">
            <span className="history-icon">
              <ClipboardCheck size={19} />
            </span>
            <div>
              <strong>Career assessment</strong>
              <small>Demo entry · Current session</small>
            </div>
            <span className="status-tag pending">In progress</span>
            <span className="history-score">—</span>
          </div>
          <div className="history-row">
            <span className="history-icon mint">
              <Sparkles size={19} />
            </span>
            <div>
              <strong>Career recommendations preview</strong>
              <small>Sample data · Not model-generated</small>
            </div>
            <span className="status-tag">Preview</span>
            <span className="history-score">5 paths</span>
          </div>
        </div>
        <div className="empty-note">
          Real attempt timestamps and saved results will appear after backend
          persistence is implemented.
        </div>
      </section>
    </>
  );
}

function Progress() {
  const bars = [
    { label: "Assessment", value: 0 },
    { label: "Career exploration", value: 60 },
    { label: "Roadmap milestones", value: 20 },
    { label: "Learning resources", value: 10 },
  ];
  return (
    <>
      <PageHeader
        eyebrow="YOUR DEVELOPMENT"
        title="Progress overview"
        description="A simple view of the areas you can work on during your career journey."
      />
      <div className="stats-grid">
        <StatCard
          icon={Target}
          label="Assessment"
          value="Pending"
          detail="Complete the demo questions"
          tone="blue"
        />
        <StatCard
          icon={BriefcaseBusiness}
          label="Careers explored"
          value="5"
          detail="Sample directory entries"
          tone="mint"
        />
        <StatCard
          icon={CheckCircle2}
          label="Milestones"
          value="1 / 5"
          detail="Local demo state"
          tone="purple"
        />
        <StatCard
          icon={Clock3}
          label="Learning hours"
          value="—"
          detail="Real time tracking not enabled"
          tone="orange"
        />
      </div>
      <section className="panel progress-breakdown">
        <SectionHeading
          title="Journey breakdown"
          subtitle="Illustrative values to preview the dashboard."
        />
        {bars.map((bar) => (
          <div className="breakdown-row" key={bar.label}>
            <div>
              <span>{bar.label}</span>
              <strong>{bar.value}%</strong>
            </div>
            <ProgressBar
              value={bar.value}
              color={bar.value >= 50 ? "mint" : "blue"}
            />
          </div>
        ))}
        <div className="demo-notice">
          <CircleHelp size={17} />
          <span>
            These values are examples, not tracked personal activity or a
            measure of career readiness.
          </span>
        </div>
      </section>
    </>
  );
}

function Profile() {
  const [profile, setProfile] = useState({
    name: "Animesh Khare",
    email: "student@example.com",
    education: "Engineering student",
    interests: "Software, data, problem solving",
  });
  const [saved, setSaved] = useState(false);

  function update(event) {
    setProfile((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setSaved(false);
  }

  function submit(event) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <>
      <PageHeader
        eyebrow="YOUR INFORMATION"
        title="My profile"
        description="Review and edit the details used in this local UI preview."
      />
      <div className="profile-layout">
        <section className="panel profile-summary">
          <div className="profile-avatar-large">AK</div>
          <h2>{profile.name || "Your name"}</h2>
          <p>{profile.education}</p>
          <span className="status-tag pending">Demo profile</span>
          <div className="profile-summary-note">
            <ShieldCheck size={17} />
            <span>
              Changes are local to this page and are not stored in an account
              yet.
            </span>
          </div>
        </section>
        <section className="panel profile-form-panel">
          <SectionHeading
            title="Profile details"
            subtitle="Fields to connect to your student profile later."
          />
          <form className="form-stack" onSubmit={submit}>
            <label className="field-label">
              Full name
              <input
                className="plain-input"
                name="name"
                value={profile.name}
                onChange={update}
                required
              />
            </label>
            <label className="field-label">
              Email address
              <input
                className="plain-input"
                type="email"
                name="email"
                value={profile.email}
                onChange={update}
                required
              />
            </label>
            <label className="field-label">
              Education / academic status
              <input
                className="plain-input"
                name="education"
                value={profile.education}
                onChange={update}
              />
            </label>
            <label className="field-label">
              Interests
              <textarea
                className="plain-input"
                name="interests"
                rows={3}
                value={profile.interests}
                onChange={update}
              />
            </label>
            {saved && (
              <div className="success-message" role="status">
                <CheckCircle2 size={17} /> Demo profile changes applied locally.
              </div>
            )}
            <button className="button button-primary" type="submit">
              Save preview changes <Check size={16} />
            </button>
          </form>
        </section>
      </div>
    </>
  );
}

function AdminOverview() {
  return (
    <>
      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Admin overview"
        description="Preview of the administrative workspace for careers, resources, and auditability."
      />
      <div className="demo-notice wide-notice">
        <ShieldCheck size={18} />
        <span>
          Admin screens are prototypes. Role-based access must be enforced by
          the backend before production use.
        </span>
      </div>
      <div className="stats-grid">
        <StatCard
          icon={BriefcaseBusiness}
          label="Career profiles"
          value="5"
          detail="Demo entries"
          tone="blue"
        />
        <StatCard
          icon={BookOpen}
          label="Resources"
          value={resources.length}
          detail="Demo resources"
          tone="mint"
        />
        <StatCard
          icon={Users}
          label="Student accounts"
          value="—"
          detail="No connected database"
          tone="purple"
        />
        <StatCard
          icon={Activity}
          label="Audit events"
          value="—"
          detail="Audit logging not connected"
          tone="orange"
        />
      </div>
      <div className="admin-link-grid">
        {[
          {
            to: "/admin/careers",
            title: "Manage careers",
            text: "Preview career profile management.",
            icon: BriefcaseBusiness,
          },
          {
            to: "/admin/resources",
            title: "Manage resources",
            text: "Preview the learning-resource list.",
            icon: BookOpen,
          },
          {
            to: "/admin/analytics",
            title: "Analytics",
            text: "Review the planned aggregate metrics.",
            icon: BarChart3,
          },
          {
            to: "/admin/audit-logs",
            title: "Audit logs",
            text: "Preview the administrative activity screen.",
            icon: ShieldCheck,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link className="admin-link-card" to={item.to} key={item.to}>
              <span className="quick-icon blue">
                <Icon size={20} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="text-link">
                Open screen <ArrowRight size={15} />
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function AdminCareers() {
  return (
    <>
      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Manage career profiles"
        description="Prototype list of career profiles used by the demo experience."
      />
      <section className="panel table-panel">
        <SectionHeading
          title="Career catalogue"
          subtitle={`${careers.length} sample profiles`}
        />
        {careers.map((career) => (
          <div className="history-row" key={career.slug}>
            <span className="history-icon">
              <BriefcaseBusiness size={19} />
            </span>
            <div>
              <strong>{career.title}</strong>
              <small>
                {career.category} · {career.skills.length} listed skills
              </small>
            </div>
            <span className="status-tag">Demo</span>
            <Link className="text-link" to={`/app/careers/${career.slug}`}>
              Preview <ArrowRight size={14} />
            </Link>
          </div>
        ))}
        <div className="empty-note">
          Create, edit, and delete actions will be connected to protected admin
          API endpoints later.
        </div>
      </section>
    </>
  );
}

function AdminResources() {
  return (
    <>
      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Manage resources"
        description="Sample resource catalogue for the resource-management screen."
      />
      <section className="panel table-panel">
        <SectionHeading
          title="Learning resources"
          subtitle={`${resources.length} sample resources`}
        />
        {resources.map((resource) => (
          <div className="history-row" key={resource.title}>
            <span className="history-icon mint">
              <BookOpen size={19} />
            </span>
            <div>
              <strong>{resource.title}</strong>
              <small>
                {resource.type} · {resource.provider}
              </small>
            </div>
            <span className="status-tag">Demo</span>
          </div>
        ))}
        <div className="empty-note">
          Resource creation, editing, validation, and deletion will be
          implemented with the backend.
        </div>
      </section>
    </>
  );
}

function AdminAnalytics() {
  return (
    <>
      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Aggregate analytics"
        description="A preview of the anonymized metrics the platform may report."
      />
      <div className="demo-notice wide-notice">
        <ShieldCheck size={18} />
        <span>
          No student analytics are collected in this prototype. The metrics
          below are placeholders, not actual users or activity.
        </span>
      </div>
      <div className="stats-grid">
        <StatCard
          icon={Users}
          label="Registered students"
          value="—"
          detail="Not connected"
          tone="blue"
        />
        <StatCard
          icon={ClipboardCheck}
          label="Assessments completed"
          value="—"
          detail="Not connected"
          tone="mint"
        />
        <StatCard
          icon={Sparkles}
          label="Recommendations generated"
          value="—"
          detail="Not connected"
          tone="purple"
        />
        <StatCard
          icon={TrendingUp}
          label="Roadmap engagement"
          value="—"
          detail="Not connected"
          tone="orange"
        />
      </div>
      <section className="panel">
        <SectionHeading
          title="Planned reporting"
          subtitle="Possible aggregate metrics once the system is implemented."
        />
        <div className="planned-metrics">
          <div>
            <CheckCircle2 size={18} />
            <span>Assessment completion rate</span>
          </div>
          <div>
            <CheckCircle2 size={18} />
            <span>Frequently explored career categories</span>
          </div>
          <div>
            <CheckCircle2 size={18} />
            <span>Resource engagement, aggregated</span>
          </div>
          <div>
            <CheckCircle2 size={18} />
            <span>Roadmap milestone completion</span>
          </div>
        </div>
      </section>
    </>
  );
}

function AdminAuditLogs() {
  return (
    <>
      <PageHeader
        eyebrow="ADMINISTRATION"
        title="Audit logs"
        description="A placeholder for traceable administrative actions."
      />
      <section className="panel empty-state">
        <ShieldCheck size={30} />
        <h2>No audit records yet</h2>
        <p>
          This prototype does not write audit events. Later, the backend will
          record relevant administrative actions with timestamps and actor
          identifiers.
        </p>
      </section>
    </>
  );
}

function NotFound() {
  return (
    <div className="panel empty-state">
      <Compass size={30} />
      <h2>Page not found</h2>
      <p>The page you requested does not exist in this prototype.</p>
      <Link className="button button-primary" to="/">
        Return home
      </Link>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage register />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="assessment" element={<Assessment />} />
        <Route path="recommendations/:id" element={<Recommendations />} />
        <Route path="careers" element={<Careers />} />
        <Route path="careers/:slug" element={<CareerDetail />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="history" element={<History />} />
        <Route path="progress" element={<Progress />} />
      </Route>
      <Route path="/admin" element={<AppLayout admin />}>
        <Route index element={<AdminOverview />} />
        <Route path="careers" element={<AdminCareers />} />
        <Route path="resources" element={<AdminResources />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
