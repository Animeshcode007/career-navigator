import { useMemo, useState, useEffect } from "react";
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
  useLocation,
  useParams,
} from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { apiRequest } from "./lib/api";
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

function useSavedRoadmapSummary() {
  const [summary, setSummary] = useState({
    completed: 0,
    total: 0,
    percent: 0,
    trackedCareers: 0,
    perCareer: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProgress() {
      try {
        const token = sessionStorage.getItem("careerNavigatorToken");

        if (!token) {
          throw new Error("Please log in to view your progress.");
        }

        const results = await Promise.all(
          careers.map(async (career) => {
            const result = await apiRequest(
              `/roadmaps/${career.slug}/progress`,
              { token, signal: controller.signal }
            );

            const saved = result.data?.completedSteps;

            if (!Array.isArray(saved)) {
              throw new Error(`Invalid progress returned for ${career.title}.`);
            }

            const validSteps = [...new Set(saved)].filter((id) => {
              const match = /^step-(\d+)$/.exec(id);
              return match && Number(match[1]) < career.roadmap.length;
            });

            return {
              slug: career.slug,
              title: career.title,
              completed: validSteps.length,
              total: career.roadmap.length,
              percent: career.roadmap.length
                ? Math.round((validSteps.length / career.roadmap.length) * 100)
                : 0,
            };
          })
        );

        if (controller.signal.aborted) return;

        const completed = results.reduce(
          (sum, item) => sum + item.completed,
          0
        );
        const total = results.reduce((sum, item) => sum + item.total, 0);

        setSummary({
          completed,
          total,
          percent: total ? Math.round((completed / total) * 100) : 0,
          trackedCareers: results.filter((item) => item.completed > 0).length,
          perCareer: results,
        });
      } catch (err) {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          setError(err.message || "Unable to load saved roadmap progress.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProgress();

    return () => controller.abort();
  }, []);

  return { summary, loading, error };
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
      {career.detailAvailable === false ? (
        <span className="text-link">Career details coming soon</span>
      ) : (
        <Link className="text-link" to={`/app/careers/${career.slug}`}>
          Explore career <ArrowRight size={15} />
        </Link>
      )}
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function update(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function submit(event) {
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
      setError("Use a password with at least 8 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await apiRequest(
        register ? "/auth/register" : "/auth/login",
        {
          method: "POST",
          body: {
            ...(register ? { name: form.name.trim() } : {}),
            email: form.email.trim().toLowerCase(),
            password: form.password,
          },
        }
      );

      const token = result.token ?? result.data?.token;
      const user = result.user ?? result.data?.user;

      if (!token) {
        console.error("Unexpected authentication response:", result);
        throw new Error(
          "The server response did not contain a token. Check the browser console."
        );
      }

      sessionStorage.setItem("careerNavigatorToken", token);

      if (user) {
        sessionStorage.setItem("careerNavigatorUser", JSON.stringify(user));
      }

      navigate("/app/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
            Your account is authenticated by the Career Navigator backend.
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
          <button
            className="button button-primary button-full"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? "Please wait..."
              : register
              ? "Create account"
              : "Log in"}
            {!submitting && <ArrowRight size={17} />}
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
  const [attempts, setAttempts] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [dashboardRecommendations, setDashboardRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recommendationsError, setRecommendationsError] = useState("");
  const {
    summary: roadmapSummary,
    loading: roadmapLoading,
    error: roadmapError,
  } = useSavedRoadmapSummary();
  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboardHistory() {
      try {
        const token = sessionStorage.getItem("careerNavigatorToken");

        if (!token) {
          throw new Error("Please log in again.");
        }

        const result = await apiRequest("/assessments/history", {
          token,
          signal: controller.signal,
        });

        if (!Array.isArray(result.data?.attempts)) {
          throw new Error("Unable to read assessment history.");
        }

        setAttempts(result.data.attempts);
      } catch (err) {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          setHistoryError(
            err.message || "Unable to load dashboard statistics."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setHistoryLoading(false);
        }
      }
    }

    loadDashboardHistory();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboardRecommendations() {
      try {
        const token = sessionStorage.getItem("careerNavigatorToken");

        if (!token) {
          throw new Error("Please log in to view career recommendations.");
        }

        const result = await apiRequest("/recommendations/current", {
          token,
          signal: controller.signal,
        });

        const payload = result.data ?? result;
        const items = Array.isArray(payload)
          ? payload
          : payload.recommendations ??
            payload.data?.recommendations ??
            result.recommendations ??
            [];

        if (!Array.isArray(items)) {
          throw new Error("Invalid recommendations response.");
        }

        const mapped = items.map((item, index) => {
          const career =
            item.career && typeof item.career === "object"
              ? item.career
              : item.profile ?? item;

          const title =
            career.title ??
            career.name ??
            item.title ??
            item.name ??
            (typeof item.career === "string" ? item.career : null) ??
            `Career ${index + 1}`;

          const localCareer = careers.find(
            (entry) =>
              entry.title.toLowerCase() === title.toLowerCase() ||
              entry.slug === career.slug ||
              entry.slug === item.slug
          );

          const rawScore = Number(
            item.matchScore ?? item.match ?? item.score ?? item.similarity ?? 0
          );

          const match = Math.round(
            Math.max(
              0,
              Math.min(100, rawScore <= 1 ? rawScore * 100 : rawScore)
            )
          );

          return {
            title,
            category:
              career.category ?? item.category ?? "Career recommendation",
            match,
            slug: localCareer?.slug,
            description:
              career.description ??
              item.explanation ??
              "Explore this career to learn more about its skills and opportunities.",
          };
        });

        if (!controller.signal.aborted) {
          setDashboardRecommendations(mapped);
        }
      } catch (err) {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          setRecommendationsError(
            err.message || "Unable to load career recommendations."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setRecommendationsLoading(false);
        }
      }
    }

    loadDashboardRecommendations();

    return () => controller.abort();
  }, []);

  const latestAttempt = attempts[0];
  const completedAttempts = attempts.filter(
    (attempt) => attempt.status === "completed"
  );

  const assessmentStatus = latestAttempt
    ? latestAttempt.status === "completed"
      ? "Completed"
      : "In progress"
    : "Not started";

  const assessmentDetail = latestAttempt
    ? `${latestAttempt.answeredCount} of ${latestAttempt.questionCount} questions answered`
    : "17 questions available";
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
          value={
            historyLoading
              ? "Loading..."
              : latestAttempt
              ? latestAttempt.status === "completed"
                ? "Completed"
                : "In progress"
              : "Not started"
          }
          detail={
            latestAttempt
              ? `${latestAttempt.answeredCount} of ${latestAttempt.questionCount} questions answered`
              : "17 questions available"
          }
          tone="blue"
        />

        <StatCard
          icon={CheckCircle2}
          label="Completed assessments"
          value={historyLoading ? "—" : completedAttempts.length}
          detail="Saved assessment attempts"
          tone="mint"
        />

        <StatCard
          icon={BookOpen}
          label="Roadmap progress"
          value={roadmapLoading ? "Loading..." : `${roadmapSummary.percent}%`}
          detail={
            roadmapLoading
              ? "Loading saved milestones"
              : `${roadmapSummary.completed} of ${roadmapSummary.total} milestones completed`
          }
          tone="purple"
        />

        <StatCard
          icon={Sparkles}
          label="Career matches"
          value={
            recommendationsLoading
              ? "Loading..."
              : dashboardRecommendations.length
          }
          detail="Returned by the recommendation service"
          tone="orange"
        />
      </div>

      {(historyError || roadmapError || recommendationsError) && (
        <div className="form-error" role="alert">
          {historyError || roadmapError || recommendationsError}
        </div>
      )}

      {historyError && (
        <div className="form-error" role="alert">
          {historyError}
        </div>
      )}

      <div className="dashboard-grid">
        <section className="panel recommendation-panel">
          <SectionHeading
            title="Your career matches"
            subtitle="Recommendations based on your completed assessment"
            action={
              <Link className="text-link" to="/app/recommendations/latest">
                View all <ArrowRight size={15} />
              </Link>
            }
          />
          {recommendationsLoading ? (
            <p>Loading your career matches...</p>
          ) : recommendationsError ? (
            <p className="form-error" role="alert">
              {recommendationsError}
            </p>
          ) : dashboardRecommendations.length === 0 ? (
            <div className="empty-note">
              Complete your assessment to see your personalized career matches.
              <Link className="text-link" to="/app/assessment">
                Start assessment <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="mini-career-list">
              {dashboardRecommendations.slice(0, 3).map((career, index) => (
                <div className="mini-career" key={`${career.title}-${index}`}>
                  <div className={`mini-career-icon mini-tone-${index}`}>
                    <BriefcaseBusiness size={19} />
                  </div>

                  <div className="mini-career-info">
                    <strong>{career.title}</strong>
                    <span>{career.category}</span>
                  </div>

                  <div className="mini-match">
                    {career.match}%<small>match</small>
                  </div>

                  <Link
                    className="mini-arrow"
                    to={
                      career.slug
                        ? `/app/careers/${career.slug}`
                        : "/app/recommendations/latest"
                    }
                    aria-label={`Explore ${career.title}`}
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>
              ))}
            </div>
          )}
          <p className="data-disclaimer">
            Match scores are exploratory guidance from the current prototype,
            not guarantees of future career success.
          </p>
        </section>

        <section className="panel progress-panel">
          <SectionHeading
            title="Your roadmap"
            subtitle="Your saved learning milestone progress"
          />

          {roadmapLoading ? (
            <p>Loading roadmap progress...</p>
          ) : roadmapError ? (
            <p className="form-error" role="alert">
              {roadmapError}
            </p>
          ) : (
            <>
              <div className="roadmap-progress">
                <div className="roadmap-progress-top">
                  <span>Across available career roadmaps</span>
                  <strong>{roadmapSummary.percent}%</strong>
                </div>

                <ProgressBar value={roadmapSummary.percent} color="mint" />

                <p>
                  {roadmapSummary.completed} of {roadmapSummary.total}{" "}
                  milestones completed across {roadmapSummary.perCareer.length}{" "}
                  career roadmaps.
                </p>
              </div>

              {roadmapSummary.perCareer
                .filter((item) => item.completed > 0)
                .slice(0, 3)
                .map((item) => (
                  <div className="breakdown-row" key={item.slug}>
                    <div>
                      <Link to="/app/roadmap" state={{ careerSlug: item.slug }}>
                        {item.title}
                      </Link>
                      <strong>{item.percent}%</strong>
                    </div>
                    <ProgressBar value={item.percent} color="mint" />
                  </div>
                ))}

              <Link className="text-link roadmap-link" to="/app/roadmap">
                Open roadmap <ArrowRight size={15} />
              </Link>
            </>
          )}
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

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [attemptId, setAttemptId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const token = sessionStorage.getItem("careerNavigatorToken");
  const question = questions[current];

  const answered = Object.keys(answers).length;
  const percent = questions.length
    ? Math.round((answered / questions.length) * 100)
    : 0;

  useEffect(() => {
    const controller = new AbortController();

    async function loadAssessment() {
      try {
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        const questionResult = await apiRequest("/assessments/questions", {
          token,
          signal: controller.signal,
        });

        const questionList = questionResult.data?.questions;

        if (!Array.isArray(questionList) || questionList.length === 0) {
          throw new Error("The server returned no assessment questions.");
        }

        const attemptResult = await apiRequest("/assessments/start", {
          method: "POST",
          token,
          signal: controller.signal,
        });

        const newAttemptId = attemptResult.data?.attemptId;

        if (!newAttemptId) {
          throw new Error(
            "The server did not return an assessment attempt ID."
          );
        }

        setQuestions(questionList);
        setAttemptId(newAttemptId);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load the assessment.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAssessment();

    return () => controller.abort();
  }, [token, navigate]);

  function choose(value) {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: value,
    }));
    setError("");
  }

  async function next() {
    if (answers[question.id] === undefined) {
      setError("Please select an answer before continuing.");
      return;
    }

    if (current < questions.length - 1) {
      setCurrent((value) => value + 1);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const answersArray = questions.map((item) => ({
        questionId: item.id,
        answer: answers[item.id],
      }));

      await apiRequest(`/assessments/${attemptId}/submit`, {
        method: "POST",
        token,
        body: {
          answers: answersArray,
        },
      });

      navigate("/app/recommendations/latest", {
        replace: true,
        state: { assessmentSubmitted: true },
      });
    } catch (err) {
      setError(err.message || "Unable to submit your assessment.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="panel">
        <p>Loading your assessment...</p>
      </section>
    );
  }

  if (error && questions.length === 0) {
    return (
      <section className="panel">
        <h2>Unable to load assessment</h2>
        <p className="form-error" role="alert">
          {error}
        </p>
        <button
          className="button button-primary"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </section>
    );
  }

  if (!question) return null;

  const selected = answers[question.id];
  const isRating = question.type === "rating";

  return (
    <section className="assessment-page">
      <PageHeader
        eyebrow="SELF-DISCOVERY"
        title="Career assessment"
        description="Explore your aptitude, interests, and academic strengths to help identify career paths worth considering."
      />

      <div className="panel">
        <div className="assessment-progress-header">
          <span>
            Question {current + 1} of {questions.length}
          </span>
          <span>{percent}% answered</span>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="progress-fill" style={{ width: `${percent}%` }} />
        </div>

        <p className="eyebrow">{question.category}</p>
        <h2>{question.question}</h2>

        <div className="assessment-options">
          {isRating
            ? (
                question.scale?.labels ?? [
                  "Very low",
                  "Low",
                  "Moderate",
                  "High",
                  "Very high",
                ]
              ).map((label, index) => {
                const value = index + 1;

                return (
                  <button
                    type="button"
                    key={value}
                    className={`assessment-option${
                      selected === value ? " selected" : ""
                    }`}
                    aria-pressed={selected === value}
                    onClick={() => choose(value)}
                  >
                    <span>{value}</span> {label}
                  </button>
                );
              })
            : question.options.map((option) => (
                <button
                  type="button"
                  key={option.id}
                  className={`assessment-option${
                    selected === option.id ? " selected" : ""
                  }`}
                  aria-pressed={selected === option.id}
                  onClick={() => choose(option.id)}
                >
                  <span>{option.id.toUpperCase()}</span> {option.text}
                </button>
              ))}
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <div className="assessment-actions">
          <button
            type="button"
            className="button button-secondary"
            disabled={current === 0 || submitting}
            onClick={() => {
              setCurrent((value) => value - 1);
              setError("");
            }}
          >
            Previous
          </button>

          <button
            type="button"
            className="button button-primary"
            disabled={submitting}
            onClick={next}
          >
            {submitting
              ? "Submitting..."
              : current === questions.length - 1
              ? "Submit assessment"
              : "Next question"}
          </button>
        </div>
      </div>
    </section>
  );
}

function Recommendations() {
  const [sort, setSort] = useState("match");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadRecommendations() {
      try {
        const token = sessionStorage.getItem("careerNavigatorToken");

        if (!token) {
          throw new Error("Please log in to view your recommendations.");
        }

        const result = await apiRequest("/recommendations/current", {
          token,
          signal: controller.signal,
        });

        const payload = result.data ?? result;

        const items = Array.isArray(payload)
          ? payload
          : payload.recommendations ??
            payload.data?.recommendations ??
            result.recommendations ??
            [];

        if (!Array.isArray(items) || items.length === 0) {
          throw new Error(
            "No recommendations were returned. Complete your assessment first."
          );
        }

        const mapped = items.map((item, index) => {
          const career = item.career ?? item.profile ?? item;

          const title =
            career.title ??
            career.name ??
            item.title ??
            item.name ??
            `Career ${index + 1}`;

          const existingCareer = careers.find(
            (entry) =>
              entry.title.toLowerCase() === title.toLowerCase() ||
              entry.slug === career.slug
          );

          const rawScore = Number(
            item.matchScore ??
              item.match ??
              item.score ??
              item.similarity ??
              career.matchScore ??
              0
          );

          const match = Math.round(
            Math.max(
              0,
              Math.min(100, rawScore <= 1 ? rawScore * 100 : rawScore)
            )
          );

          const reasons = Array.isArray(item.reasons)
            ? item.reasons.join(" ")
            : typeof item.reasons === "string"
            ? item.reasons
            : "";

          return {
            ...career,
            slug:
              career.slug ??
              item.slug ??
              existingCareer?.slug ??
              title
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-"),
            title,
            category:
              career.category ?? item.category ?? "Career recommendation",
            description:
              career.description ??
              item.explanation ??
              reasons ??
              existingCareer?.description ??
              "Explore this career to learn more about its skills and opportunities.",
            match,
            detailAvailable: Boolean(existingCareer),
          };
        });

        if (!controller.signal.aborted) {
          setRecommendations(mapped);
        }
      } catch (err) {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          setError(err.message || "Unable to load career recommendations.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadRecommendations();

    return () => controller.abort();
  }, []);

  const sorted = useMemo(() => {
    const copy = [...recommendations];

    if (sort === "alphabetical") {
      copy.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      copy.sort((a, b) => b.match - a.match);
    }

    return copy;
  }, [recommendations, sort]);

  return (
    <>
      <PageHeader
        eyebrow="YOUR POSSIBLE DIRECTIONS"
        title="Career recommendations"
        description="Explore career matches generated from your completed assessment."
        action={
          <Link className="button button-secondary" to="/app/assessment">
            Retake assessment
          </Link>
        }
      />

      {loading && (
        <section className="panel">
          <p>Analysing your assessment and loading career matches...</p>
        </section>
      )}

      {!loading && error && (
        <section className="panel empty-state">
          <h2>Recommendations unavailable</h2>
          <p>{error}</p>
          <button
            className="button button-primary"
            type="button"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
          <Link className="button button-secondary" to="/app/assessment">
            Take assessment
          </Link>
        </section>
      )}

      {!loading && !error && (
        <>
          <div className="demo-notice wide-notice">
            <Lightbulb size={18} />
            <span>
              These matches are guidance based on the current prototype's career
              profiles, not guarantees of future career success.
            </span>
          </div>

          <div className="recommendation-summary panel">
            <div className="summary-emblem">
              <Sparkles size={24} />
            </div>
            <div>
              <strong>Your career shortlist</strong>
              <p>
                Compare the ranked options and explore which skills and learning
                paths may suit your interests.
              </p>
            </div>
            <div className="summary-count">
              <strong>{String(sorted.length).padStart(2, "0")}</strong>
              <span>Career matches</span>
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
                <option value="match">Match score</option>
                <option value="alphabetical">Career name</option>
              </select>
            </label>
          </div>

          <div className="career-grid">
            {sorted.map((career, index) => (
              <CareerCard
                key={`${career.slug}-${index}`}
                career={career}
                rank={index + 1}
              />
            ))}
          </div>
        </>
      )}
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
            <Link
              className="text-link"
              to="/app/roadmap"
              state={{ careerSlug: career.slug }}
            >
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
  const location = useLocation();

  const requestedSlug =
    location.state?.careerSlug ||
    sessionStorage.getItem("careerNavigatorSelectedCareerSlug");

  const career =
    careers.find((item) => item.slug === requestedSlug) || careers[0];

  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const token = sessionStorage.getItem("careerNavigatorToken");
  const steps = career.roadmap;
  const percent = Math.round(
    (completed.length / Math.max(steps.length, 1)) * 100
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadProgress() {
      setLoading(true);
      setError("");
      setCompleted([]);

      try {
        if (!token) {
          throw new Error("Please log in to view your roadmap progress.");
        }

        const result = await apiRequest(`/roadmaps/${career.slug}/progress`, {
          token,
          signal: controller.signal,
        });

        const savedSteps = result.data?.completedSteps;

        if (!Array.isArray(savedSteps)) {
          throw new Error("The server returned invalid roadmap progress.");
        }

        if (!controller.signal.aborted) {
          const validSteps = savedSteps.filter((id) => {
            const match = /^step-(\d+)$/.exec(id);
            return match && Number(match[1]) < steps.length;
          });

          setCompleted([...new Set(validSteps)]);
          sessionStorage.setItem(
            "careerNavigatorSelectedCareerSlug",
            career.slug
          );
        }
      } catch (err) {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          setError(err.message || "Unable to load roadmap progress.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProgress();

    return () => controller.abort();
  }, [career.slug, token, steps.length]);

  async function toggle(index) {
    if (saving || loading) return;

    const stepId = `step-${index}`;
    const previous = completed;

    const next = previous.includes(stepId)
      ? previous.filter((id) => id !== stepId)
      : [...previous, stepId];

    setCompleted(next);
    setSaving(true);
    setError("");
    setSavedMessage("");

    try {
      await apiRequest(`/roadmaps/${career.slug}/progress`, {
        method: "PUT",
        token,
        body: { completedSteps: next },
      });

      setSavedMessage("Progress saved to your account.");
    } catch (err) {
      setCompleted(previous);
      setError(err.message || "Unable to save progress.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="YOUR ACTION PLAN"
        title="My roadmap"
        description="Work through milestones and track your progress for each career."
      />

      <div className="roadmap-banner panel">
        <div className="roadmap-banner-icon">
          <Compass size={27} />
        </div>

        <div className="roadmap-banner-copy">
          <div className="eyebrow">CAREER ROADMAP</div>
          <h2>{career.title}</h2>
          <p>
            Follow these suggested steps to build skills and practical
            experience for this career path.
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
          subtitle={`${completed.length} of ${steps.length} completed`}
        />

        {loading && <p>Loading saved progress...</p>}

        {!loading &&
          steps.map((step, index) => {
            const stepId = `step-${index}`;
            const done = completed.includes(stepId);

            return (
              <button
                type="button"
                className={`milestone-row${done ? " milestone-done" : ""}`}
                key={stepId}
                onClick={() => toggle(index)}
                disabled={saving}
                aria-pressed={done}
              >
                <span className={`milestone-check${done ? " checked" : ""}`}>
                  {done && <Check size={15} />}
                </span>

                <span className="milestone-content">
                  <strong>{step}</strong>
                  <small>
                    {done ? "Marked complete" : "Not completed yet"}
                  </small>
                </span>

                <span className="milestone-step">STEP {index + 1}</span>
              </button>
            );
          })}

        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        {savedMessage && <p role="status">{savedMessage}</p>}

        {saving && <p>Saving your progress...</p>}

        <div className="demo-notice">
          <ShieldCheck size={17} />
          <span>
            Your completed milestones are stored with your account. Progress is
            tracked separately for each career.
          </span>
        </div>
      </section>
    </>
  );
}

function History() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadHistory() {
      try {
        const token = sessionStorage.getItem("careerNavigatorToken");

        if (!token) {
          throw new Error("Please log in to view your assessment history.");
        }

        const result = await apiRequest("/assessments/history", {
          token,
          signal: controller.signal,
        });

        const items = result.data?.attempts;

        if (!Array.isArray(items)) {
          throw new Error("The server returned an invalid history response.");
        }

        setAttempts(items);
      } catch (err) {
        if (err.name !== "AbortError" && !controller.signal.aborted) {
          setError(err.message || "Unable to load assessment history.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadHistory();
    return () => controller.abort();
  }, []);

  function formatDate(value) {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? "Date unavailable"
      : date.toLocaleString();
  }

  return (
    <>
      <PageHeader
        eyebrow="YOUR ACTIVITY"
        title="Assessment history"
        description="Review your saved assessment attempts and completion status."
        action={
          <Link className="button button-primary" to="/app/assessment">
            Take assessment
          </Link>
        }
      />

      <section className="panel table-panel">
        <SectionHeading
          title="Your assessment attempts"
          subtitle={`${attempts.length} saved attempt${
            attempts.length === 1 ? "" : "s"
          }`}
        />

        {loading && <p>Loading your assessment history...</p>}

        {!loading && error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && attempts.length === 0 && (
          <div className="empty-state">
            <Clock3 size={28} />
            <h3>No assessment history yet</h3>
            <p>
              Complete your first career assessment to see your saved attempts
              here.
            </p>
            <Link className="button button-primary" to="/app/assessment">
              Start assessment
            </Link>
          </div>
        )}

        {!loading && !error && attempts.length > 0 && (
          <div className="history-list">
            {attempts.map((attempt) => {
              const complete = attempt.status === "completed";

              return (
                <div className="history-row" key={attempt.id}>
                  <span className={`history-icon${complete ? " mint" : ""}`}>
                    {complete ? (
                      <CheckCircle2 size={19} />
                    ) : (
                      <Clock3 size={19} />
                    )}
                  </span>

                  <div>
                    <strong>Career assessment</strong>
                    <small>
                      {formatDate(attempt.submittedAt || attempt.startedAt)}
                    </small>
                    <small>
                      {attempt.answeredCount} of {attempt.questionCount}{" "}
                      questions answered
                    </small>
                  </div>

                  <span className={`status-tag${complete ? "" : " pending"}`}>
                    {complete ? "Completed" : "In progress"}
                  </span>

                  <span className="history-score">
                    {complete ? "Scores saved" : "Draft"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

function Progress() {
  const { summary, loading, error } = useSavedRoadmapSummary();

  return (
    <>
      <PageHeader
        eyebrow="YOUR DEVELOPMENT"
        title="Progress overview"
        description="Track the learning milestones you've completed across your career roadmaps."
      />

      {loading ? (
        <section className="panel">
          <p>Loading your saved progress...</p>
        </section>
      ) : error ? (
        <section className="panel">
          <div className="form-error" role="alert">
            {error}
          </div>
        </section>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              icon={TrendingUp}
              label="Overall roadmap completion"
              value={`${summary.percent}%`}
              detail="Across available career roadmaps"
              tone="blue"
            />

            <StatCard
              icon={CheckCircle2}
              label="Completed milestones"
              value={summary.completed}
              detail={`Out of ${summary.total} available milestones`}
              tone="mint"
            />

            <StatCard
              icon={BriefcaseBusiness}
              label="Roadmaps started"
              value={summary.trackedCareers}
              detail="Career roadmaps with completed milestones"
              tone="purple"
            />
          </div>

          <section className="panel progress-breakdown">
            <SectionHeading
              title="Roadmap progress by career"
              subtitle="Open any roadmap to continue working through its milestones."
            />

            {summary.perCareer.map((item) => (
              <div className="breakdown-row" key={item.slug}>
                <div>
                  <Link to="/app/roadmap" state={{ careerSlug: item.slug }}>
                    {item.title}
                  </Link>
                  <strong>{item.percent}%</strong>
                </div>

                <ProgressBar
                  value={item.percent}
                  color={item.percent === 100 ? "mint" : "blue"}
                />

                <small>
                  {item.completed} of {item.total} milestones completed
                </small>
              </div>
            ))}
          </section>
        </>
      )}
    </>
  );
}

function Profile() {
  const savedUser = JSON.parse(
    sessionStorage.getItem("careerNavigatorUser") || "{}"
  );
  const [profile, setProfile] = useState({
    name: savedUser.name || "",
    email: savedUser.email || "",
    education: "Engineering student",
    interests: "",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const initials = profile.name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  useEffect(() => {
    const controller = new AbortController();

    async function loadProfile() {
      try {
        const token = sessionStorage.getItem("careerNavigatorToken");
        if (!token) return;

        const result = await apiRequest("/auth/me", {
          token,
          signal: controller.signal,
        });

        const user = result.data.user;

        setProfile((current) => ({
          ...current,
          name: user.name || "",
          email: user.email || "",
          education: user.education || "",
          interests: user.interests || "",
        }));

        sessionStorage.setItem("careerNavigatorUser", JSON.stringify(user));
      } catch (error) {
        if (error.name !== "AbortError") {
          setProfileError(error.message || "Unable to load your profile.");
        }
      }
    }

    loadProfile();

    return () => controller.abort();
  }, []);
  function update(event) {
    setProfile((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
    setSaved(false);
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setSaved(false);
    setProfileError("");

    try {
      const token = sessionStorage.getItem("careerNavigatorToken");

      if (!token) {
        throw new Error("Please log in again.");
      }

      const result = await apiRequest("/auth/me", {
        method: "PATCH",
        token,
        body: {
          name: profile.name,
          education: profile.education,
          interests: profile.interests,
        },
      });

      const updatedUser = result.data.user;

      sessionStorage.setItem(
        "careerNavigatorUser",
        JSON.stringify(updatedUser)
      );

      setProfile((current) => ({
        ...current,
        name: updatedUser.name,
        email: updatedUser.email,
        education: updatedUser.education || "",
        interests: updatedUser.interests || "",
      }));

      setSaved(true);
    } catch (error) {
      setProfileError(error.message || "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="YOUR INFORMATION"
        title="My profile"
        description="Review your account details and personal career interests."
      />
      <div className="profile-layout">
        <section className="panel profile-summary">
          <div className="profile-avatar-large">{initials || "U"}</div>
          <h2>{profile.name || "Your name"}</h2>
          <p>{profile.education}</p>
          <span className="status-tag pending">Registered account</span>
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
            subtitle="Manage your student profile details."
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
            {profileError && (
              <div className="form-error" role="alert">
                {profileError}
              </div>
            )}
            {saved && (
              <div className="form-success" role="status">
                Profile saved successfully.
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
function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("careerNavigatorToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage register />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
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
