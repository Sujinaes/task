import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ChevronRight,
  Play,
  Factory,
  Store,
  Users,
  ShieldCheck,
  Link as LinkIcon,
  UserCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Shield,
  Globe,
  Lock,
} from "lucide-react";
import styles from "./Home.module.css";
import { Logo } from "../../components/logo/Logo";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // when window width increase, then make the isOpen = false
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav
      className={`${styles.nav_navbar} ${scrolled ? styles.nav_scrolled : ""}`}
    >
      <div className={styles.nav_container}>
        <Logo />
        <div className={styles.nav_desktopLinks}>
          {["Services", "Features", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={styles.nav_link}
            >
              {item}
            </a>
          ))}
        </div>

        <div className={styles.nav_desktopActions}>
          <Link to="/login">
            <button className={styles.nav_signInBtn}>Sign In</button>
          </Link>
          <Link to="/register">
            <button className={`${styles.nav_registerBtn} gold-gradient`}>
              Register
            </button>
          </Link>
        </div>

        <button
          className={styles.nav_mobileToggle}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className={styles.nav_mobileMenu}>
          {["Features", "Services", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className={styles.nav_mobileLink}
            >
              {item}
            </a>
          ))}
          <hr className={styles.nav_divider} />
          <Link to="/login">
             <button className={styles.nav_mobileSignInBtn}>Sign In</button>
          </Link>
          <Link to="/register">
             <button className={`${styles.nav_mobileSignInBtn} ${styles.color_gold_gradient}`}>
              Register
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className={styles.hero_hero}>
      <div className={styles.hero_overlay}></div>
      <div className={styles.hero_container}>
        <div className={styles.hero_content}>
          <div className={`${styles.hero_badge} animate-fade-in-up`}>
            <span className={styles.hero_badgeText}>
              Warranty Management, Simplified
            </span>
          </div>
          <h1 className={`${styles.hero_title} animate-fade-in-up`}>
            Register Products.
            <br />Claim Warranties.{" "}
            <br />
            <span className={styles.hero_goldText}>Get Resolved Fast.</span>

          </h1>
          <p className={`${styles.hero_description} animate-fade-in-up`}>
            WPOMS connects manufacturers, vendors, customers, and staff on a
            single platform to manage the complete warranty lifecycle — from
            product registration to claim approval, transparently and efficiently.
          </p>
          <div className={`${styles.hero_actions} animate-fade-in-up`}>
            <Link to="/register">
              <button className={`${styles.hero_primaryBtn} gold-gradient`}>
                Get Started <ChevronRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section >
  );
};


const servicesList = [
  {
    title: "Manufacturers",
    description:
      "List your products, issue warranties, and review incoming claims. Approve or reject warranty requests with full context and keep your customers informed at every step.",
    icon: Factory,
    color: "gold",
  },
  {
    title: "Vendors",
    description:
      "Manage your product catalog and facilitate the purchase experience. Bridge the gap between manufacturers and customers with streamlined order processing.",
    icon: Store,
    color: "navy",
  },
  {
    title: "Customers",
    description:
      "Register your purchased products, activate warranties, and raise claims whenever issues arise. Track the status of every claim in real time — all in one place.",
    icon: Users,
    color: "gold",
  },
  {
    title: "Staff",
    description:
      "Support manufacturers and vendors by handling day-to-day tasks — processing claims, updating statuses, and communicating with customers — with scoped, role-based access.",
    icon: UserCheck,
    color: "gold",
  },
];


const Services = () => {
  return (
    <section id="services" className={styles.serv_services}>
      <div className={styles.serv_container}>
        <div className={styles.serv_header}>
          <h2 className={styles.serv_title}>Orchestrated Roles</h2>
          <p className={styles.serv_subtitle}>
            A unified ecosystem designed for every stakeholder in the
            procurement lifecycle.
          </p>
        </div>
        <div className={styles.serv_grid}>
          {servicesList.map((service, index) => (
            <div key={index} className={`${styles.serv_card} animate-scale-in`}>
              <div
                className={`${styles.serv_iconWrapper} ${styles.serv_goldIcon}`}
              >
                <service.icon size={32} />
              </div>
              <h3 className={styles.serv_cardTitle}>{service.title}</h3>
              <p className={styles.serv_cardDescription}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section id="features" className={styles.feat_features}>
      <div className={styles.feat_container}>
        <div className={styles.feat_grid}>
          <div className={styles.feat_content}>
            <h2 className={styles.feat_title}>
              Manage Warranties<br /> End-to-End
            </h2>
            <p className={styles.feat_subtitle}>
              From the moment a product is purchased to the final resolution of
              a claim, WPOMS handles it all with clarity and control.
            </p>
            <div className={styles.feat_featureList}>
              <div className={styles.feat_featureItem}>
                <div className={styles.feat_iconWrapper}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className={styles.feat_featureTitle}>
                    Product Registration & Warranty Activation
                  </h3>
                  <p className={styles.feat_featureDescription}>
                    Customers register purchased products directly on the platform
                    to activate their warranty — no paperwork, no hassle.
                  </p>
                </div>
              </div>
              <div className={styles.feat_featureItem}>
                <div className={styles.feat_iconWrapper}>
                  <LinkIcon size={24} />
                </div>
                <div>
                  <h3 className={styles.feat_featureTitle}>
                    Structured Claim Submission
                  </h3>
                  <p className={styles.feat_featureDescription}>
                    Customers submit claims with all necessary details and
                    attachments — manufacturers can review, communicate, and
                    resolve issues efficiently.
                  </p>
                </div>
              </div>
              {/* <div className={styles.feat_featureItem}>
                <div className={styles.feat_iconWrapper}>
                  <UserCheck size={24} />
                </div>
                <div>
                  <h3 className={styles.feat_featureTitle}>
                    Manufacturer Approval Workflow
                  </h3>
                  <p className={styles.feat_featureDescription}>
                    Manufacturers review and approve or reject claims with
                    clear reasoning, keeping the process transparent and
                    accountable.
                  </p>
                </div>
              </div> */}
              {/* <div className={styles.feat_featureItem}>
                <div className={styles.feat_iconWrapper}>
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className={styles.feat_featureTitle}>Role-Based Access for Staff</h3>
                  <p className={styles.feat_featureDescription}>
                    Staff members under manufacturers or vendors get scoped access
                    to handle tasks without full administrative control.
                  </p>
                </div>
              </div> */}
            </div>
          </div>
          <div className={`${styles.feat_imageWrapper} `}>
            <div className={`${styles.feat_imageContainer} `}>
              <img
                src="./dashboard.png"
                alt="Data Visualization"
                className={styles.feat_image}
                referrerPolicy="no-referrer"
              />
              <div className={`${styles.feat_statCard} animate-scale-in`}>
                <div className={styles.feat_statValue}>99.9%</div>
                <div className={styles.feat_statLabel}>Claim Traceability</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


const faqs = [
  {
    question: "How do I register a product and activate my warranty?",
    answer:
      "After purchasing a product, sign in to WPOMS as a customer, navigate to 'My Products', and register your product using the purchase details. This automatically activates the warranty associated with it.",
  },
  {
    question: "How do I submit a warranty claim?",
    answer:
      "Go to the registered product in your dashboard, click 'Raise a Claim', describe the issue in detail, and submit. The claim is instantly sent to the manufacturer for review.",
  },
  {
    question: "How does the manufacturer approve or reject a claim?",
    answer:
      "Manufacturers and their staff receive claims in their dashboard. They can review the details, add notes, and approve or reject the claim. You'll be notified of the decision with any reasoning provided.",
  },
  {
    question: "What can staff members do on WPOMS?",
    answer:
      "Staff are sub-accounts under a manufacturer or vendor. They can handle tasks like reviewing claims, updating statuses, and communicating with customers — but don't have full administrative access like creating products or managing accounts.",
  },
  {
    question: "Can vendors raise warranty claims on behalf of customers?",
    answer:
      "Vendors primarily manage their product catalog and orders. Warranty claims are raised by customers directly and processed by manufacturers, keeping the chain clear and accountable.",
  },
];


const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className={styles.faq_faq}>
      <div className={styles.faq_container}>
        <div className={styles.faq_header}>
          <h2 className={styles.faq_title}>Frequently Asked Questions</h2>
          <p className={styles.faq_subtitle}>
            Everything you need to know about the WPOMS ecosystem.
          </p>
        </div>
        <div className={styles.faq_faqList}>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`${styles.faq_faqItem} ${activeIndex === index ? styles.faq_active : ""}`}
            >
              <button
                className={styles.faq_questionBtn}
                onClick={() => toggleFAQ(index)}
              >
                <span className={styles.faq_question}>{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              <div
                className={`${styles.faq_answerWrapper} ${activeIndex === index ? styles.faq_show : ""}`}
              >
                <div className={styles.faq_answer}>{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className={styles.cta_cta}>
      <div className={styles.cta_container}>
        <div className={`${styles.cta_card} gold-gradient`}>
          <div className={styles.cta_content}>
            <h2 className={styles.cta_title}>
              Start Managing Warranties the Right Way.
            </h2>
            <p className={styles.cta_subtitle}>
              Join manufacturers, vendors, and customers who rely on WPOMS for
              a clear, accountable warranty process — from registration to resolution.
            </p>
            <div className={styles.cta_actions}>
              <Link to="/register">
              <button className={`${styles.cta_primaryBtn}`}>
                Register Now <ArrowRight size={20} />
              </button>
            </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


const Footer = () => {
  return (
    <footer className={styles.foot_footer}>
      <div className={styles.foot_container}>
        <div className={styles.foot_grid}>
          <div className={styles.foot_branding}>
            <Logo />
            <p className={styles.foot_tagline}>
              Warranty Management for Manufacturers, Vendors & Customers.
            </p>
          </div>
          <div className={styles.foot_linksGrid}>
            <div>
              <h4 className={styles.foot_linkTitle}>Platform</h4>
              <ul className={styles.foot_linkList}>
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#services">Services</a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className={styles.foot_bottom}>
          <p className={styles.foot_copyright}>© 2026 WPOMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
const Home = () => {
  return (
    <div className={styles.home}>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Features />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
