import React, { useState } from 'react';
import { FileDown } from 'lucide-react';

interface ContactProps {
  data: {
    full_name: string;
    current_title: string;
    location: string;
    cv_url?: string;
    contact: {
      email: string;
      linkedin: string;
    };
  };
}

const Contact: React.FC<ContactProps> = ({ data }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create mailto link with form data
    const subject = `Business Inquiry from ${formData.name}${formData.company ? ` - ${formData.company}` : ''}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\n${formData.company ? `Company: ${formData.company}\n` : ''}\nMessage:\n${formData.message}`;
    const mailtoLink = `mailto:${data.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Contact Eduardo
            </h2>
            <p className="text-muted-foreground mt-6 text-lg max-w-3xl mx-auto">
              Ready to discuss your next infrastructure project or executive opportunity? Let's connect and explore how my expertise can drive your organization's success.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold text-foreground">Get In Touch</h3>
              
              {/* Contact Cards */}
              <div className="space-y-6">
                {/* CV Download Card - HIGHLY VISIBLE */}
                {data.cv_url && (
                  <a 
                    href={data.cv_url}
                    download
                    className="block p-6 bg-primary/5 rounded-xl border-2 border-primary/20 shadow-md hover:shadow-xl hover:border-primary/50 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-2">
                      <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider animate-pulse">
                        Available
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mr-5 shadow-lg group-hover:scale-110 transition-transform">
                        <FileDown className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="text-foreground font-bold text-lg mb-1">Executive Resume</h4>
                        <p className="text-primary font-medium flex items-center">
                          Download CV (PDF)
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </p>
                      </div>
                    </div>
                  </a>
                )}

                {/* Email */}
                <a 
                  href={`mailto:${data.contact.email}`}
                  className="block p-6 bg-background rounded-xl border border-border shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-foreground font-semibold mb-1">Email</h4>
                      <p className="text-primary group-hover:text-primary/80 transition-colors">{data.contact.email}</p>
                    </div>
                  </div>
                </a>

                {/* LinkedIn */}
                <a 
                  href={data.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 bg-background rounded-xl border border-border shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                      <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-foreground font-semibold mb-1">LinkedIn</h4>
                      <p className="text-primary group-hover:text-primary/80 transition-colors">Professional Profile</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-background p-8 rounded-xl border border-border shadow-lg">
              <h3 className="text-2xl font-semibold text-foreground mb-6">Send a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                      placeholder="your.email@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-muted-foreground mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                    placeholder="Tell Eduardo about your project or opportunity..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Send Message
                </button>
              </form>

              <div className="mt-6 text-center text-muted-foreground text-sm">
                <p>Form submissions open your default email client</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 border-t border-border pt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-muted-foreground text-sm">
              © 2025 {data.full_name}. All rights reserved. | {data.current_title}
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
