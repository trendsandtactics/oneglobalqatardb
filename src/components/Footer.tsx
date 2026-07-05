import {
  Facebook,
  Linkedin,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getSiteContent, defaultContent } from "@/pages/api";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data: siteContent } = useQuery({ queryKey: ["siteContent"], queryFn: getSiteContent });

  const footer = siteContent?.footer || defaultContent.footer;
  const quickLinks = footer.quickLinks?.length ? footer.quickLinks : defaultContent.footer.quickLinks;
  const contact = siteContent?.siteSettings?.contact || defaultContent.siteSettings.contact;
  const social = siteContent?.siteSettings?.social || defaultContent.siteSettings.social;

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleLinkClick = (link: typeof quickLinks[0]) => {
    if (link.isPage) {
      navigate(link.id);
    } else {
      scrollToSection(link.id);
    }
  };

  const socialLinks = [
    { icon: Facebook, href: social.facebook, label: "Facebook" },
    { icon: Linkedin, href: social.linkedin, label: "LinkedIn" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* MAIN FOOTER */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ABOUT + LOGO */}
          <div>
            <img
              src={footer.logo}
              alt="One Global Logistics"
              className="h-14 mb-4"
            />

            <h3 className="font-heading font-bold text-base mb-3">About Us</h3>
            <p className="text-sm text-primary-foreground/75 leading-6">
              {footer.aboutBlurb}
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="md:pl-8">
            <h3 className="font-heading font-bold text-base mb-3">
              Quick Links
            </h3>

            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleLinkClick(link)}
                    className="group flex items-center gap-2 text-sm text-primary-foreground/75 hover:text-accent transition"
                  >
                    <span className="text-accent opacity-0 group-hover:opacity-100 transition">
                      →
                    </span>
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* OFFICE */}
          <div>
            <h3 className="font-heading font-bold text-base mb-3">
              Our Office
            </h3>

            <div className="space-y-3 text-sm text-primary-foreground/75">
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-accent mt-1" />
                <div>
                  {contact.addressLines.map((line, idx) => (
                    <p key={idx} className={idx === 0 ? "font-semibold" : undefined}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <Phone className="w-4 h-4 text-accent" />
                <p>{contact.phones.slice(0, 2).map((p, i) => (i === 0 ? p : ` / ${p.replace('+974 ', '')}`)).join('')}</p>
              </div>

              <div className="flex gap-2 items-center">
                <Mail className="w-4 h-4 text-accent" />
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-accent underline"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-primary-foreground/60">
            {footer.copyright}
          </p>

          <div className="flex gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${social.label} page`}
                  className="hover:text-accent transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
