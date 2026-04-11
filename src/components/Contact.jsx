import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Contact.css";

gsap.registerPlugin(ScrollTrigger);

const FORMSUBMIT_ENDPOINT = "https://formsubmit.co/ajax/amore43035@gmail.com";
const WEBSITE_NAME = "Shakti Creations";

const SOCIALS = [
  {
    label: "Instagram",
    handle: "@shakti_kale_official",
    href: "https://instagram.com/shakti_kale_official",
  },
  {
    label: "YouTube",
    handle: "@shaktiscreation",
    href: "https://www.youtube.com/@shaktiscreation",
  },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
      gsap.fromTo(
        rightRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );

      gsap.fromTo(
        leftRef.current?.querySelectorAll("[data-text-fx]") || [],
        { y: 28, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.72,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        },
      );

      gsap.fromTo(
        rightRef.current?.querySelectorAll("[data-form-fx]") || [],
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.62,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 74%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("email", form.email.trim());
      payload.append("service", form.service);
      payload.append("message", form.message.trim());
      payload.append(
        "_subject",
        `${WEBSITE_NAME} • New Contact Request (${form.service})`,
      );
      payload.append("_template", "table");
      payload.append("_captcha", "false");
      payload.append("_replyto", form.email.trim());

      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        body: payload,
        headers: {
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      const data = await res.json();
      if (data?.success !== "true" && data?.success !== true) {
        throw new Error("Submission failed");
      }

      setSent(true);
      setForm({
        name: "",
        email: "",
        service: "",
        message: "",
      });

      gsap.fromTo(
        ".contact-success",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      );
    } catch (_err) {
      setSubmitError(
        "Could not send right now. Please try again or email amore43035@gmail.com.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="contact">
      {/* Background accent */}
      <div className="contact-bg-accent" />

      <div className="contact-inner">
        {/* LEFT */}
        <div ref={leftRef} className="contact-left">
          <span className="section-label" data-text-fx>
            Contact
          </span>
          <h2 className="contact-heading" data-text-fx>
            Let's create
            <br />
            <em>something iconic</em>
          </h2>
          <p className="contact-body" data-text-fx>
            Whether you have a full brief or just an idea — reach out. Every
            great project starts with a conversation.
          </p>

          <div className="contact-info-list">
            <div className="contact-info-item" data-text-fx>
              <span className="contact-info-label">Email</span>
              <a
                href="mailto:amore43035@gmail.com"
                className="contact-info-value"
              >
                amore43035@gmail.com
              </a>
            </div>
            <div className="contact-info-item" data-text-fx>
              <span className="contact-info-label">Based In</span>
              <span className="contact-info-value">Pune, India</span>
            </div>
            <div className="contact-info-item" data-text-fx>
              <span className="contact-info-label">Available For</span>
              <span className="contact-info-value">Worldwide Projects</span>
            </div>
          </div>

          <div className="contact-socials">
            {SOCIALS.map((s, i) => (
              <a key={i} href={s.href} className="social-link" data-text-fx>
                <span className="social-label">{s.label}</span>
                <span className="social-handle">{s.handle}</span>
                <svg
                  className="social-arrow"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M2 12L12 2M12 2H5M12 2V9"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT — Form */}
        <div ref={rightRef} className="contact-right">
          {!sent ? (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row" data-form-fx>
                <div className="form-group" data-form-fx>
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Priya Sharma"
                    required
                  />
                </div>
                <div className="form-group" data-form-fx>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="hello@brand.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group" data-form-fx>
                <label className="form-label">Service Interested In</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="form-input form-select"
                  required
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  <option value="model">Model Photoshoot</option>
                  <option value="brand">Brand Content</option>
                  <option value="travel">Travel Filmmaking</option>
                  <option value="other">Other / Collab</option>
                </select>
              </div>

              <div className="form-group" data-form-fx>
                <label className="form-label">Tell Me About Your Project</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  placeholder="Share your vision, timeline, and any details..."
                  rows={5}
                  required
                />
              </div>

              <button
                type="submit"
                className="form-submit"
                data-form-fx
                disabled={submitting}
              >
                <span>{submitting ? "Sending..." : "Send Message"}</span>
                <div className="submit-arrow">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M3 9H15M15 9L10 4M15 9L10 14"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>
              </button>

              {submitError && (
                <p className="form-error" role="alert" aria-live="polite">
                  {submitError}
                </p>
              )}
            </form>
          ) : (
            <div className="contact-success">
              <div className="success-icon">✦</div>
              <h3 className="success-heading">Message Received</h3>
              <p className="success-body">
                Thank you for reaching out. I'll get back to you within 24
                hours.
              </p>
              <button
                type="button"
                className="form-submit success-reset"
                onClick={() => {
                  setSent(false);
                  setSubmitError("");
                }}
              >
                <span>Send Another Request</span>
                <div className="submit-arrow">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M3 9H15M15 9L10 4M15 9L10 14"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
