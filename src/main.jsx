import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Menu, X, Sparkles } from "lucide-react";
import "./styles.css";

const navigation = [
  {
    id: "discover",
    number: "01",
    title: "Discover",
    note: "Find your next rabbit hole",
    color: "peach",
    items: [
      { title: "What's on", description: "A quick look at everything happening.", tag: "OVERVIEW" },
      { title: "The line-up", description: "Browse the full programme and schedule.", tag: "PROGRAMME", externalUrl: "https://www.google.com" },
      { title: "Places to go", description: "Explore spaces, stages and experiences.", tag: "VENUES" },
      { title: "The field guide", description: "A curated list of ideas, people and things.", tag: "GUIDE" }
    ]
  },
  {
    id: "create",
    number: "02",
    title: "Create",
    note: "Ideas become things",
    color: "mint",
    items: [
      { title: "Workshops", description: "Get hands-on and learn by making.", tag: "LEARN", externalUrl: "https://www.bing.com" },
      { title: "Challenges", description: "Put your skills to the test.", tag: "COMPETE" },
      { title: "Showcase", description: "See what the community has made.", tag: "EXPLORE" }
    ]
  },
  {
    id: "community",
    number: "03",
    title: "Community",
    note: "Good things happen together",
    color: "lilac",
    items: [
      { title: "People", description: "Meet the people behind the ideas.", tag: "TEAM", externalUrl: "https://www.mnit.ac.in" },
      { title: "Partners", description: "The friends who make it possible.", tag: "NETWORK" },
      { title: "Get involved", description: "Find your way into the community.", tag: "JOIN IN" }
    ]
  },
  {
    id: "visit",
    number: "04",
    title: "Plan your visit",
    note: "Make a day of it",
    color: "butter",
    items: [
      { title: "Getting here", description: "Routes, transport and arrival info.", tag: "TRAVEL" },
      { title: "FAQs", description: "Useful answers before you set off.", tag: "HELP" },
      { title: "Contact", description: "Need a hand? Talk to the team.", tag: "SAY HELLO" }
    ]
  }
];

const cardVariants = {
  hidden: { opacity:  0, y: 24, rotate: 1.5 },
  visible: (i) => ({
    opacity: 1, y: 0, rotate: 0,
    transition: { delay: i * 0.075, duration: 0.42, ease: [0.22, 1, 0.36, 1] }
  }),
  exit: { opacity: 0, y: -12, transition: { duration: 0.16 } }
};

function getSunPosition() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const progress = Math.max(0, Math.min(1, (minutes - 7 * 60) / (12 * 60)));
  const elevation = Math.sin(Math.PI * progress);

  return {
    "--sun-x": `${progress * 100}%`,
    "--sun-y": `${50 - elevation * 35}%`
  };
}

function Landscape() {
  const [sunPosition, setSunPosition] = useState(getSunPosition);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSunPosition(getSunPosition());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="landscape" aria-hidden="true">
      <div className="sun" style={sunPosition} />
      <div className="cloud cloud-one"><i /><i /><i /></div>
      <div className="cloud cloud-two"><i /><i /><i /></div>
      <svg className="hills" viewBox="0 0 1440 430" preserveAspectRatio="none">
        <path d="M0 205 C180 110 290 190 440 165 C610 135 690 40 870 120 C1030 190 1140 90 1440 145 L1440 430 L0 430Z" fill="#c4d6bd"/>
        <path d="M0 270 C180 180 360 250 520 220 C720 180 850 250 1010 195 C1190 130 1300 205 1440 190 L1440 430 L0 430Z" fill="#91b59e"/>
        <path d="M0 325 C230 260 360 300 560 280 C780 250 950 315 1120 260 C1280 220 1360 265 1440 250 L1440 430 L0 430Z" fill="#547e6e"/>
      </svg>
      <div className="hill-flower flower-a">✳</div>
      <div className="hill-flower flower-b">✿</div>
      <div className="hill-flower flower-c">✳</div>
      <div className="bird bird-a">⌁</div>
      <div className="bird bird-b">⌁</div>
    </div>
  );
}

function CassetteCard({ section, index, onClick }) {
  return (
    <motion.button
      className={`cassette cassette-${section.color}`}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ x: 9, rotate: index % 2 ? 1 : -1, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      onClick={onClick}
      aria-label={`Open ${section.title} submenu`}
    >
      <span className="cassette-number">{section.number}</span>
      <span className="cassette-label">
        <span className="cassette-kicker">BLITZ TECH / INDEX</span>
        <strong>{section.title}</strong>
        <small>{section.note}</small>
      </span>
      <span className="cassette-spools"><i /><i /></span>
      <span className="cassette-arrow"><ArrowUpRight size={19} /></span>
    </motion.button>
  );
}

function DetailCard({ item, index, onChoose }) {
  const CardElement = item.externalUrl ? motion.a : motion.button;

  return (
    <CardElement
      className="detail-card"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -5, rotate: index % 2 ? -0.5 : 0.5 }}
      whileTap={{ scale: 0.985 }}
      {...(item.externalUrl
        ? { href: item.externalUrl, target: "_blank", rel: "noreferrer" }
        : { onClick: () => onChoose(item) })}
    >
      <span className="detail-tag">{item.tag}</span>
      <span className="detail-title">{item.title}</span>
      <span className="detail-description">{item.description}</span>
      <span className="detail-bottom"><span>OPEN SECTION</span><ArrowUpRight size={18} /></span>
    </CardElement>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const active = navigation.find((section) => section.id === activeSection);

  function closeMenu() {
    setMenuOpen(false);
    setActiveSection(null);
    setSelectedItem(null);
  }

  function goBack() {
    if (selectedItem) setSelectedItem(null);
    else setActiveSection(null);
  }

  return (
    <main className="page-shell">
      <Landscape />
      <header className="topbar">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); closeMenu(); }}>
          <span className="brand-mark">BT<span>✳</span></span>
          <span className="brand-name">BLITZ TECH<small>AN INDEPENDENT GATHERING</small></span>
        </a>
        <div className="top-actions">
          <span className="edition">VOL. 01 / 2026</span>
          <button className="menu-toggle" onClick={() => menuOpen ? closeMenu() : setMenuOpen(true)} aria-label={menuOpen ? "Close menu" : "Open menu"}>
            <span>{menuOpen ? "CLOSE" : "MENU"}</span>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <section className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-dot" /> A PLACE FOR CURIOUS MINDS</p>
        <h1>Make room<br />for <em>what's next.</em></h1>
        <p className="hero-description">A little field guide to ideas, people and things worth discovering. Wander around. Find your people. Make something happen.</p>
        <button className="explore-button" onClick={() => setMenuOpen(true)}>EXPLORE THE INDEX <ArrowUpRight size={17} /></button>
      </section>

      <div className="bottom-note">
        <span>EST. FOR THE CURIOUS</span>
        <span>SCROLL LESS. DISCOVER MORE. <Sparkles size={13} /></span>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.section className="menu-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="overlay-wash" />
            <div className="overlay-header">
              <div className="overlay-heading">
                <span className="eyebrow"><span className="eyebrow-dot" /> THE FIELD GUIDE</span>
                <h2>{selectedItem ? selectedItem.title : active ? active.title : "Pick a direction."}</h2>
                <p>{selectedItem ? "A closer look at this part of the field guide." : active ? active.note : "A few paths worth wandering down."}</p>
              </div>
              <button className="close-button" onClick={closeMenu} aria-label="Close navigation"><X size={22} /><span>ESC</span></button>
            </div>

            <div className="menu-content">
              <AnimatePresence mode="wait">
                {selectedItem ? (
                  <motion.div key="selected" className="selected-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                    <div className="selected-stamp">{selectedItem.tag}</div>
                    <h3>{selectedItem.title}</h3>
                    <p>{selectedItem.description}</p>
                    <p className="selected-placeholder">This is a prototype destination. Replace this panel with your actual page or route.</p>
                    <button className="back-button" onClick={goBack}><ArrowLeft size={16} /> BACK TO {active?.title.toUpperCase()}</button>
                  </motion.div>
                ) : active ? (
                  <motion.div key={active.id} className="detail-grid" initial="hidden" animate="visible" exit="exit">
                    <motion.button className="back-tile" onClick={goBack} initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ArrowLeft size={17} /> ALL SECTIONS</motion.button>
                    {active.items.map((item, index) => <DetailCard key={item.title} item={item} index={index} onChoose={setSelectedItem} />)}
                  </motion.div>
                ) : (
                  <motion.div key="main" className="cassette-stack" initial="hidden" animate="visible" exit="exit">
                    {navigation.map((section, index) => (
                      <CassetteCard key={section.id} section={section} index={index} onClick={() => setActiveSection(section.id)} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <footer className="overlay-footer">
              <span>BLITZ TECH © 2026</span>
              <span>{selectedItem ? "SECTION PREVIEW" : active ? `${active.number} / SUBSECTIONS` : "SELECT A LABEL TO CONTINUE"}</span>
              <span>MADE FOR THE CURIOUS ✳</span>
            </footer>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
