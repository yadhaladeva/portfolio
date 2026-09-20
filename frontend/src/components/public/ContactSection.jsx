import React, { useState } from 'react';
import { Mail, Send, MapPin, Linkedin, Github, Phone, CheckCircle2, AlertCircle } from 'lucide-react';
import { publicApi } from '../../api/publicApi';
import { Footer } from '../common/Footer';

const DEFAULT_CONTACT = {
  badgeText: 'GET IN TOUCH',
  introText: 'Open to software engineering, backend development, and technical collaboration opportunities.',
  location: 'Chennai, India',
  email: 'devayadhala.dev@gmail.com',
  phone: null,
  linkedinUrl: 'https://linkedin.com',
  githubUrl: 'https://github.com',
  formTitle: 'Send a Message',
  formDescription: 'Fill in your contact details below to send an inquiry directly to my portfolio database.',
  namePlaceholder: 'e.g. John Doe',
  emailPlaceholder: 'e.g. john@company.com',
  subjectPlaceholder: 'e.g. Job opportunity / Collaboration',
  messagePlaceholder: 'Write your message here...',
  submitButtonText: 'Send Message'
};

export const ContactSection = ({ contactSettings, onShowToast }) => {
  const data = contactSettings || DEFAULT_CONTACT;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await publicApi.submitContact(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      if (onShowToast) {
        onShowToast('success', 'Your message has been sent successfully! Deva will get back to you shortly.');
      }
    } catch (err) {
      console.error('Contact submission error', err);
      const message = err.response?.data?.message || 'Failed to send message. Please try again or reach out via email.';
      setErrorMsg(message);
      if (onShowToast) {
        onShowToast('error', message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="pt-24 pb-0 relative bg-dark-850/40 flex flex-col justify-between">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            {data.badgeText || DEFAULT_CONTACT.badgeText}
          </div>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            {data.introText || DEFAULT_CONTACT.introText}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-stretch mb-6 sm:mb-8">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="glass-card p-6 sm:p-7 rounded-2xl flex-1 flex flex-col border border-slate-800 space-y-5">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-display mb-1.5">
                  Contact Information
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Feel free to connect directly via LinkedIn, explore my repositories on GitHub, or send a message using the form.
                </p>
              </div>

              <div className="space-y-3.5 pt-1">
                {/* Location */}
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Location</span>
                    <p className="text-xs sm:text-sm font-medium text-white">
                      {data.location || DEFAULT_CONTACT.location}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3.5">
                  <a
                    href={`mailto:${data.email || DEFAULT_CONTACT.email}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(data.email || DEFAULT_CONTACT.email)}`, '_blank', 'noopener,noreferrer');
                    }}
                    className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 hover:scale-105 flex items-center justify-center shrink-0 transition-all cursor-pointer"
                    title="Click to compose email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Email</span>
                    <a
                      href={`mailto:${data.email || DEFAULT_CONTACT.email}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(data.email || DEFAULT_CONTACT.email)}`, '_blank', 'noopener,noreferrer');
                      }}
                      className="text-xs sm:text-sm font-medium text-amber-400 hover:text-amber-300 hover:underline transition-all cursor-pointer"
                      title="Click to compose email"
                    >
                      {data.email || DEFAULT_CONTACT.email}
                    </a>
                  </div>
                </div>

                {/* Optional Phone */}
                {data.phone && (
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Phone</span>
                      <a
                        href={`tel:${data.phone}`}
                        className="text-xs sm:text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
                      >
                        {data.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* LinkedIn */}
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">LinkedIn</span>
                    <a
                      href={data.linkedinUrl || DEFAULT_CONTACT.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                    >
                      <span>Connect on LinkedIn</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>

                {/* GitHub */}
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">GitHub</span>
                    <a
                      href={data.githubUrl || DEFAULT_CONTACT.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                    >
                      <span>Explore GitHub Repositories</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="glass-card p-6 rounded-2xl flex-1 flex flex-col justify-between border border-slate-800">
              {submitted ? (
                <div className="text-center py-8 space-y-3.5 my-auto">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-display">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs text-slate-300 max-w-sm mx-auto">
                    Thank you for reaching out. Your inquiry has been saved securely. I will get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-dark-800 hover:bg-dark-750 text-emerald-400 border border-slate-700 transition-colors mt-2 cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-lg font-bold text-white font-display mb-0.5">
                      {data.formTitle || DEFAULT_CONTACT.formTitle}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3">
                      {data.formDescription || DEFAULT_CONTACT.formDescription}
                    </p>

                    {errorMsg && (
                      <div className="p-2.5 mb-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Your Name <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={data.namePlaceholder || DEFAULT_CONTACT.namePlaceholder}
                            className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Your Email <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={data.emailPlaceholder || DEFAULT_CONTACT.emailPlaceholder}
                            className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Subject
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder={data.subjectPlaceholder || DEFAULT_CONTACT.subjectPlaceholder}
                          className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          Message <span className="text-rose-400">*</span>
                        </label>
                        <textarea
                          name="message"
                          required
                          rows={3}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder={data.messagePlaceholder || DEFAULT_CONTACT.messagePlaceholder}
                          className="w-full px-3.5 py-2 text-sm bg-dark-800 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none h-28"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 sm:py-3 px-6 rounded-xl font-semibold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-1"
                  >
                    {isSubmitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{data.submitButtonText || DEFAULT_CONTACT.submitButtonText}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Footer Bar */}
      <Footer />
    </section>
  );
};

export default ContactSection;


