import { useEffect, useRef, useState } from "react";

/* ---------- Brand + data ---------- */
const BRAND = "LAB EXPERT";
const MAKER = "JET DIGITAL INFOTECH";
const u = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const IMG = {
  a: u("1579154204601-01588f351e67"), b: u("1532187863486-abf9dbad1b69"), c: u("1582719471384-894fbb16e074"),
  d: u("1576091160399-112ba8d25d1d"), e: u("1530026405186-ed1f139313f8", 1600),
};
const VIDEO = "https://videos.pexels.com/video-files/3191572/3191572-uhd_2560_1440_25fps.mp4";

const services = [
  { t: "Pathology & Blood Tests", d: "CBC, lipid, liver, kidney and 200+ parameters on automated analysers.", img: IMG.a, tag: "from ₹199" },
  { t: "Molecular Diagnostics", d: "PCR-based testing with strict contamination control and expert review.", img: IMG.b, tag: "from ₹899" },
  { t: "Preventive Checkups", d: "Age and risk based panels designed with practising physicians.", img: IMG.c, tag: "from ₹799" },
  { t: "Home Collection", d: "Certified phlebotomists, sealed kits and live sample tracking.", img: IMG.d, tag: "Free above ₹500" },
  { t: "Corporate Wellness", d: "On-site camps and annual health programmes for teams of any size.", img: IMG.e, tag: "Custom quote" },
];
const tests = [
  ["Complete Blood Count", "Popular", "₹249", "6 hrs"], ["HbA1c", "Diabetes", "₹399", "8 hrs"],
  ["Fasting Glucose", "Diabetes", "₹99", "4 hrs"], ["Lipid Profile", "Heart", "₹449", "8 hrs"],
  ["hs-CRP", "Heart", "₹599", "12 hrs"], ["Thyroid Profile (T3 T4 TSH)", "Thyroid", "₹499", "8 hrs"],
  ["Vitamin D (25-OH)", "Vitamins", "₹899", "24 hrs"], ["Vitamin B12", "Vitamins", "₹699", "24 hrs"],
  ["Liver Function Test", "Popular", "₹549", "8 hrs"], ["Kidney Function Test", "Popular", "₹599", "8 hrs"],
];
const cats = ["All", "Popular", "Diabetes", "Heart", "Thyroid", "Vitamins"];
const plans = [
  { n: "Essential", p: "₹799", s: "For a yearly check", l: ["35+ parameters", "Report in 24 hrs", "Digital report + trends"] },
  { n: "Complete", p: "₹1,999", s: "Most chosen by families", l: ["85+ parameters", "Free home pickup", "Doctor tele-consult", "Report in 12 hrs"], hot: true },
  { n: "Executive", p: "₹3,999", s: "Deep preventive screen", l: ["110+ parameters", "Cancer & cardiac markers", "Dietitian session", "Priority reporting"] },
];
const steps = [
  ["Book in a minute", "Pick tests, choose a slot, confirm on call or WhatsApp."],
  ["Sample collected", "A certified phlebotomist arrives on time with sealed, barcoded kits."],
  ["Analysed with care", "Automated machines, daily calibration, pathologist-verified values."],
  ["Report delivered", "Secure PDF with trend graphs, plus doctor guidance when you need it."],
];
const quotes = [
  ["The phlebotomist was punctual and gentle. My father’s reports came the same evening.", "Priya Sharma", "Andheri"],
  ["Trend graphs across years made our doctor visit ten minutes shorter.", "Rahul Verma", "Powai"],
  ["We moved our whole office checkup here. Zero chaos, great coordination.", "Anita Desai", "HR Lead, BKC"],
];
const faqs = [
  ["Do I need to fast?", "Glucose and lipid tests need 8–10 hours of fasting. We confirm this when you book."],
  ["How fast are reports?", "Routine reports arrive in 6–24 hours. Specialised tests list their time on the test card."],
  ["Is home collection safe?", "Yes. Single-use needles, sealed kits and temperature-controlled transport."],
  ["Can I share reports with my doctor?", "Every report is a secure link and PDF you can forward in one tap."],
];

/* ---------- Helpers ---------- */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf;
    const f = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setY(window.scrollY)); };
    window.addEventListener("scroll", f, { passive: true });
    return () => { window.removeEventListener("scroll", f); cancelAnimationFrame(raf); };
  }, []);
  return y;
}
function useSeen() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold: 0.15 });
    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}
function Reveal({ children, delay = 0, className = "", x = 0, y = 36 }) {
  const [ref, seen] = useSeen();
  return (
    <div ref={ref} className={`transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(.16,1,.3,1)] ${className}`}
      style={{ opacity: seen ? 1 : 0, transform: seen ? "none" : `translate(${x}px,${y}px)`, transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}
function Tilt({ children, className = "", max = 8 }) {
  const ref = useRef(null);
  return (
    <div ref={ref} className={className} style={{ transition: "transform .3s ease-out", transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const r = ref.current.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        ref.current.style.transform = `perspective(1000px) rotateX(${-py * max}deg) rotateY(${px * max}deg)`;
      }}
      onMouseLeave={() => (ref.current.style.transform = "perspective(1000px)")}>
      {children}
    </div>
  );
}
function Counter({ to, suffix = "" }) {
  const [ref, seen] = useSeen();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!seen) return;
    let s;
    const f = (t) => { s = s || t; const p = Math.min((t - s) / 1800, 1); setV(Math.round((1 - (1 - p) ** 4) * to)); p < 1 && requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }, [seen, to]);
  return <span ref={ref}>{v.toLocaleString("en-IN")}{suffix}</span>;
}
function Photo({ src, alt = "", className = "", style }) {
  const [bad, setBad] = useState(false);
  return bad ? <div style={style} className={`bg-gradient-to-br from-[#E4EBFF] to-[#F3F6FF] ${className}`} />
    : <img src={src} alt={alt} loading="lazy" style={style} onError={() => setBad(true)} className={`object-cover ${className}`} />;
}
const Maker = ({ className = "" }) => <span className={`font-semibold ${className}`}>{MAKER}</span>;
const grad = "bg-gradient-to-r from-[#2F5BEA] to-[#6F93FF]";

/* ---------- Sections ---------- */
function Nav({ y }) {
  const [open, setOpen] = useState(false);
  const links = ["Services", "Tests", "Plans", "Process", "FAQ"];
  const total = typeof document !== "undefined" ? document.documentElement.scrollHeight - window.innerHeight : 1;
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-[#0A1A2F] text-[#C9D6F5] text-[11px] tracking-wide text-center py-1.5">
        Digital experience by <Maker className="text-[#E3C77A]" />
      </div>
      <div className={`mx-auto transition-all duration-500 ${y > 40 ? "mt-3 max-w-5xl rounded-full bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(10,26,47,.25)] border border-white" : "max-w-7xl bg-transparent"}`}>
        <div className="px-6 h-16 flex items-center justify-between">
          <a href="#top" className="font-display text-xl font-extrabold text-[#0A1A2F] tracking-tight">{BRAND}<span className="text-[#2F5BEA]">.</span></a>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            {links.map((l) => <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#2F5BEA] transition">{l}</a>)}
          </nav>
          <a href="#contact" className={`hidden md:block px-5 py-2.5 rounded-full text-white text-sm font-semibold ${grad} hover:shadow-lg hover:shadow-blue-300/50 transition`}>Book a test</a>
          <button className="md:hidden text-xl" onClick={() => setOpen(!open)}>{open ? "✕" : "☰"}</button>
        </div>
        {open && <div className="md:hidden px-6 pb-5 flex flex-col gap-3">{links.map((l) => <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}>{l}</a>)}</div>}
      </div>
      <div className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-[#B8923A]" style={{ transform: `scaleX(${total > 0 ? y / total : 0})`, opacity: y > 40 ? 0 : 1 }} />
    </header>
  );
}

function Helix() {
  const n = 17;
  return (
    <div className="relative mx-auto h-[480px] w-[220px]" style={{ perspective: 900 }}>
      <div className="absolute inset-0 animate-helix" style={{ transformStyle: "preserve-3d" }}>
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} className="absolute left-1/2 -ml-[85px] w-[170px] flex items-center" style={{ top: i * 28, transform: `rotateY(${i * 24}deg)`, transformStyle: "preserve-3d" }}>
            <span className="w-3.5 h-3.5 rounded-full bg-[#2F5BEA] shadow-[0_0_18px_#6F93FF]" />
            <span className="flex-1 h-px bg-gradient-to-r from-[#2F5BEA]/50 to-[#B8923A]/70" />
            <span className="w-3.5 h-3.5 rounded-full bg-[#D9B55A] shadow-[0_0_18px_#E3C77A]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-40 pb-28 bg-[#F7F9FC]">
      <div className="absolute right-[-10%] top-10 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-[#DDE6FF] to-[#FFF4D6] blur-3xl opacity-80" />
      <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-[1.15fr_.85fr] gap-10 items-center">
        <div>
          <Reveal><p className="inline-flex items-center gap-2 text-sm text-slate-600 bg-white rounded-full pl-2 pr-4 py-1.5 shadow-sm border border-slate-100"><span className={`px-2.5 py-0.5 rounded-full text-white text-xs ${grad}`}>New</span>Live sample tracking on WhatsApp</p></Reveal>
          <Reveal delay={120}><h1 className="font-display mt-7 text-5xl md:text-[5.2rem] leading-[1.02] font-extrabold tracking-tight text-[#0A1A2F]">Precision you can feel in every result.</h1></Reveal>
          <Reveal delay={240}><p className="mt-7 text-lg text-slate-600 max-w-xl leading-relaxed">{BRAND} combines automated analysers, pathologist review and doorstep sample collection, so your report is accurate, fast and easy to understand.</p></Reveal>
          <Reveal delay={360} className="mt-10 flex flex-wrap items-center gap-5">
            <a href="#contact" className={`px-8 py-4 rounded-full text-white font-semibold ${grad} shadow-xl shadow-blue-300/50 hover:-translate-y-1 transition`}>Book home pickup</a>
            <a href="#tests" className="px-8 py-4 rounded-full bg-white border border-slate-200 text-[#0A1A2F] font-semibold hover:border-[#2F5BEA] hover:-translate-y-1 transition">Find a test</a>
          </Reveal>
          <Reveal delay={480} className="mt-12 flex gap-10 text-sm text-slate-500">
            {[["4.9", "Average rating"], ["6 hrs", "Fastest report"], ["24×7", "Support line"]].map(([a, b]) => <div key={b}><p className="font-display text-2xl font-bold text-[#0A1A2F]">{a}</p>{b}</div>)}
          </Reveal>
        </div>
        <Reveal x={40} y={0} className="relative">
          <Helix />
          <div className="absolute left-0 top-16 bg-white/70 backdrop-blur-xl border border-white rounded-2xl px-4 py-3 shadow-xl animate-float"><p className="text-[11px] text-slate-500">Sample status</p><p className="text-sm font-semibold text-[#0A1A2F]">Analysing ●</p></div>
          <div className="absolute right-0 bottom-20 bg-white/70 backdrop-blur-xl border border-white rounded-2xl px-4 py-3 shadow-xl animate-float" style={{ animationDelay: "1.5s" }}><p className="text-[11px] text-slate-500">Report ready</p><p className="text-sm font-semibold text-[#2F5BEA]">Tap to view</p></div>
        </Reveal>
      </div>
    </section>
  );
}

function Title({ k, title, sub }) {
  return (
    <Reveal className="max-w-2xl mb-14">
      <p className="text-sm font-semibold text-[#B8923A]">{k}</p>
      <h2 className="font-display mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-[#0A1A2F]">{title}</h2>
      <p className="mt-4 text-slate-600 text-lg leading-relaxed">{sub}</p>
    </Reveal>
  );
}

function Services() {
  const ref = useRef(null);
  const go = (d) => ref.current.scrollBy({ left: d * 360, behavior: "smooth" });
  return (
    <section id="services" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between">
          <Title k="What we do" title="Diagnostics for every stage of life" sub="Five service lines, one standard of quality." />
          <div className="hidden md:flex gap-3 mb-14">
            {["←", "→"].map((a, i) => <button key={a} onClick={() => go(i ? 1 : -1)} className="w-12 h-12 rounded-full border border-slate-200 hover:bg-[#0A1A2F] hover:text-white transition">{a}</button>)}
          </div>
        </div>
      </div>
      <div ref={ref} className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-6 md:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-6 no-bar">
        {services.map((s) => (
          <Tilt key={s.t} max={6} className="snap-start shrink-0 w-[300px] md:w-[340px]">
            <article className="group h-full rounded-[1.75rem] bg-[#F7F9FC] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-100 transition-shadow duration-500">
              <div className="h-52 overflow-hidden"><Photo src={s.img} alt={s.t} className="w-full h-full group-hover:scale-110 transition duration-[1200ms]" /></div>
              <div className="p-7">
                <span className="text-xs font-semibold text-[#2F5BEA] bg-[#E9EEFF] rounded-full px-3 py-1">{s.tag}</span>
                <h3 className="font-display mt-4 text-xl font-bold text-[#0A1A2F]">{s.t}</h3>
                <p className="mt-2 text-slate-600 text-sm leading-relaxed">{s.d}</p>
              </div>
            </article>
          </Tilt>
        ))}
      </div>
    </section>
  );
}

function Stats({ y }) {
  const s = [[250000, "+", "Reports delivered"], [120, "+", "Parameters tested"], [45, "+", "Pathologists"], [99, "%", "Repeat customers"]];
  return (
    <section className="relative py-28 overflow-hidden bg-[#0A1A2F] text-white">
      <Photo src={IMG.e} className="absolute inset-0 w-full h-[130%] opacity-20" style={{ transform: `translateY(${-(y * 0.08)}px)` }} />
      <div className="relative max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {s.map(([n, suf, l], i) => (
          <Reveal key={l} delay={i * 120}>
            <p className="font-display text-5xl md:text-6xl font-extrabold bg-gradient-to-b from-white to-[#9DB4FF] bg-clip-text text-transparent"><Counter to={n} suffix={suf} /></p>
            <p className="mt-2 text-[#9DB4FF] text-sm">{l}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Tests() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const list = tests.filter(([n, c]) => (cat === "All" || c === cat) && n.toLowerCase().includes(q.toLowerCase()));
  return (
    <section id="tests" className="py-28 bg-[#F7F9FC]">
      <div className="max-w-5xl mx-auto px-6">
        <Title k="Test finder" title="Find your test and price instantly" sub="Transparent pricing with the turnaround time shown up front." />
        <div className="flex flex-wrap gap-3 items-center mb-8">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a test" className="flex-1 min-w-[200px] px-6 py-3.5 rounded-full bg-white border border-slate-200 outline-none focus:border-[#2F5BEA] focus:ring-4 focus:ring-blue-100 transition" />
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full text-sm font-medium transition ${cat === c ? "bg-[#0A1A2F] text-white" : "bg-white text-slate-600 hover:bg-[#E9EEFF]"}`}>{c}</button>)}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {list.map(([n, c, p, t]) => (
            <div key={n} className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 hover:border-[#2F5BEA]/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300">
              <div><p className="font-semibold text-[#0A1A2F]">{n}</p><p className="text-xs text-slate-500 mt-1">{c} · Report in {t}</p></div>
              <div className="text-right"><p className="font-display font-bold text-[#0A1A2F]">{p}</p><a href="#contact" className="text-xs text-[#2F5BEA] font-semibold">Book</a></div>
            </div>
          ))}
          {!list.length && <p className="text-slate-500 py-8">No test found. Call us and we will help you choose.</p>}
        </div>
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section id="plans" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <Title k="Health plans" title="Checkup plans, clearly priced" sub="Home pickup and digital reports included in every plan." />
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((p, i) => (
            <Reveal key={p.n} delay={i * 130} className="h-full">
              <Tilt className="h-full" max={5}>
                <div className={`h-full rounded-[1.75rem] p-8 ${p.hot ? "bg-[#0A1A2F] text-white shadow-2xl shadow-blue-300/40 md:-translate-y-4" : "bg-[#F7F9FC] border border-slate-100"}`}>
                  {p.hot && <span className="text-xs font-semibold bg-[#D9B55A] text-[#0A1A2F] rounded-full px-3 py-1">Most chosen</span>}
                  <h3 className="font-display mt-4 text-2xl font-bold">{p.n}</h3>
                  <p className={`text-sm ${p.hot ? "text-[#9DB4FF]" : "text-slate-500"}`}>{p.s}</p>
                  <p className="font-display text-5xl font-extrabold mt-6">{p.p}</p>
                  <ul className="mt-6 space-y-3 text-sm">{p.l.map((x) => <li key={x} className="flex gap-3"><span className={p.hot ? "text-[#E3C77A]" : "text-[#2F5BEA]"}>✓</span>{x}</li>)}</ul>
                  <a href="#contact" className={`mt-8 block text-center py-3.5 rounded-full font-semibold transition ${p.hot ? "bg-white text-[#0A1A2F] hover:bg-[#E3C77A]" : `${grad} text-white hover:shadow-lg`}`}>Choose {p.n}</a>
                </div>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoBand({ y }) {
  return (
    <section className="relative h-[520px] overflow-hidden bg-[#0A1A2F]">
      <video src={VIDEO} poster={IMG.e} autoPlay muted loop playsInline className="absolute inset-0 w-full h-[125%] object-cover opacity-70" style={{ transform: `translateY(${-(y * 0.05)}px)` }} onError={(e) => (e.currentTarget.style.display = "none")} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A2F] via-[#0A1A2F]/40 to-transparent" />
      <Reveal className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16 text-white">
        <h2 className="font-display text-4xl md:text-6xl font-extrabold max-w-2xl tracking-tight">Inside a lab that never compromises.</h2>
        <p className="mt-4 text-[#C9D6F5] max-w-lg">Daily calibration, barcoded samples and double verification on every report.</p>
      </Reveal>
    </section>
  );
}

function Process() {
  return (
    <section id="process" className="py-28 bg-[#F7F9FC]">
      <div className="max-w-4xl mx-auto px-6">
        <Title k="How it works" title="Four steps from booking to report" sub="Every stage is tracked, so you always know where your sample is." />
        <div className="relative border-l-2 border-[#DDE6FF] ml-4">
          {steps.map(([t, d], i) => (
            <Reveal key={t} delay={i * 100} x={-24} y={0} className="relative pl-10 pb-12 last:pb-0">
              <span className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full ${grad} text-white text-sm font-bold grid place-items-center shadow-lg shadow-blue-300/50`}>{i + 1}</span>
              <h3 className="font-display text-2xl font-bold text-[#0A1A2F]">{t}</h3>
              <p className="mt-2 text-slate-600 max-w-lg leading-relaxed">{d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Quotes() {
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % quotes.length), 5000); return () => clearInterval(t); }, []);
  return (
    <section className="py-28 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="relative h-[250px] md:h-[210px]">
          {quotes.map(([q, n, p], k) => (
            <div key={n} className="absolute inset-0 transition-all duration-[900ms]" style={{ opacity: k === i ? 1 : 0, transform: `translateY(${k === i ? 0 : 24}px) scale(${k === i ? 1 : 0.97})`, pointerEvents: k === i ? "auto" : "none" }}>
              <p className="font-display text-2xl md:text-4xl font-bold leading-snug text-[#0A1A2F]">“{q}”</p>
              <p className="mt-6 text-slate-600"><span className="font-semibold text-[#0A1A2F]">{n}</span> · {p}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2">
          {quotes.map((_, k) => <button key={k} aria-label={`Quote ${k + 1}`} onClick={() => setI(k)} className={`h-2 rounded-full transition-all duration-500 ${k === i ? "w-10 bg-[#2F5BEA]" : "w-2 bg-slate-300"}`} />)}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [o, setO] = useState(0);
  return (
    <section id="faq" className="py-28 bg-[#F7F9FC]">
      <div className="max-w-3xl mx-auto px-6">
        <Title k="FAQ" title="Before you book" sub="Short, honest answers." />
        {faqs.map(([q, a], k) => (
          <div key={q} className="border-b border-slate-200">
            <button onClick={() => setO(o === k ? -1 : k)} className="w-full flex justify-between py-6 text-left font-display text-lg font-bold text-[#0A1A2F] hover:text-[#2F5BEA] transition">{q}<span className={`transition-transform duration-300 ${o === k ? "rotate-45" : ""}`}>+</span></button>
            <div className={`grid transition-all duration-500 ${o === k ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"}`}><p className="overflow-hidden text-slate-600 leading-relaxed">{a}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const f = "w-full px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-[#9DB4FF] outline-none focus:border-[#E3C77A] transition";
  return (
    <section id="contact" className="py-28 bg-gradient-to-br from-[#0A1A2F] to-[#16306B] text-white">
      <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
        <Reveal>
          <h2 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight">Book your test in under a minute.</h2>
          <p className="mt-5 text-[#C9D6F5] max-w-md">Our care team confirms your slot within 30 minutes.</p>
          <div className="mt-8 space-y-2 text-[#C9D6F5]"><p>+91 98765 43210</p><p>care@labexpert.in</p><p>Mumbai, Maharashtra</p></div>
          <p className="mt-8 text-sm text-[#9DB4FF]">Website by <Maker className="text-[#E3C77A]" /></p>
        </Reveal>
        <Reveal delay={150}>
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="rounded-[1.75rem] bg-white/10 backdrop-blur-xl border border-white/20 p-8 space-y-4">
            {sent ? <p className="py-16 text-center font-display text-2xl">Thank you. We will call you shortly.</p> : <>
              <input required placeholder="Full name" className={f} />
              <input required type="tel" placeholder="Phone number" className={f} />
              <select defaultValue="" className={f}><option value="" disabled className="text-slate-800">Select a plan</option>{plans.map((p) => <option key={p.n} className="text-slate-800">{p.n}</option>)}</select>
              <input type="date" className={f} />
              <button className="w-full py-4 rounded-xl bg-[#E3C77A] text-[#0A1A2F] font-bold hover:bg-white transition">Request booking</button>
            </>}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#07111F] text-[#9DB4FF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10 grid md:grid-cols-4 gap-10 text-sm">
        <div className="md:col-span-2">
          <p className="font-display text-2xl font-extrabold text-white">{BRAND}</p>
          <p className="mt-3 max-w-sm leading-relaxed">Accurate pathology with doorstep collection and digital reports.</p>
          <p className="mt-6">Crafted by <Maker className="text-[#E3C77A]" /></p>
        </div>
        <div><p className="text-white font-semibold mb-3">Explore</p>{["Services", "Tests", "Plans", "Process", "FAQ"].map((l) => <a key={l} href={`#${l.toLowerCase()}`} className="block py-1 hover:text-white transition">{l}</a>)}</div>
        <div><p className="text-white font-semibold mb-3">Website partner</p><Maker className="text-[#E3C77A]" /><p className="mt-2 leading-relaxed">Web design, development and digital growth for healthcare brands.</p></div>
      </div>
      <p className="font-display text-center text-[17vw] leading-none font-extrabold tracking-tighter text-transparent select-none" style={{ WebkitTextStroke: "1px rgba(157,180,255,.25)" }}>{BRAND}</p>
      <div className="border-t border-white/10 py-5 px-6 text-center text-xs">© {new Date().getFullYear()} {BRAND}. All rights reserved. Designed &amp; developed by <Maker className="text-[#E3C77A]" /></div>
    </footer>
  );
}

const Badge = () => (
  <a href="#top" className="fixed bottom-5 right-5 z-40 px-4 py-2 rounded-full bg-white/85 backdrop-blur-xl border border-white shadow-xl text-xs text-[#0A1A2F] hover:-translate-y-1 transition">Built by <Maker className="text-[#2F5BEA]" /></a>
);

/* ---------- App ---------- */
export default function App() {
  const y = useScrollY();
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(l);
    document.documentElement.style.scrollBehavior = "smooth";
    return () => l.remove();
  }, []);
  return (
    <div className="antialiased text-slate-700" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        .font-display{font-family:'Bricolage Grotesque','DM Sans',sans-serif}
        @keyframes helix{to{transform:rotateY(360deg)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        .animate-helix{animation:helix 16s linear infinite}
        .animate-float{animation:float 6s ease-in-out infinite}
        .no-bar{scrollbar-width:none}.no-bar::-webkit-scrollbar{display:none}
        section[id]{scroll-margin-top:90px}
        @media (prefers-reduced-motion:reduce){.animate-helix,.animate-float{animation:none}html{scroll-behavior:auto!important}}
      `}</style>
      <Nav y={y} />
      <Hero />
      <Services />
      <Stats y={y} />
      <Tests />
      <Plans />
      <VideoBand y={y} />
      <Process />
      <Quotes />
      <FAQ />
      <Contact />
      <Footer />
      <Badge />
    </div>
  );
}