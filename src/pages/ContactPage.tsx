import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Globe, Send } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getSiteContent, defaultContent } from '@/pages/api';

const ContactPage = () => {
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const { data: siteContent } = useQuery({ queryKey: ['siteContent'], queryFn: getSiteContent });

  const hero = siteContent?.contactPage?.hero || defaultContent.contactPage.hero;
  const mapEmbedUrl = siteContent?.contactPage?.mapEmbedUrl || defaultContent.contactPage.mapEmbedUrl;
  const contact = siteContent?.siteSettings?.contact || defaultContent.siteSettings.contact;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${contact.email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            _subject: 'New Contact Form Submission – One Global Qatar',
            _captcha: 'false',
          }),
        }
      );

      if (!response.ok) throw new Error('Failed');

      toast({
        title: 'Message Sent!',
        description: "We'll get back to you as soon as possible.",
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      toast({
        title: 'Submission Failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      lines: contact.addressLines,
    },
    {
      icon: Phone,
      title: 'Phone',
      lines: contact.phones,
    },
    {
      icon: Mail,
      title: 'Email',
      lines: [contact.email],
    },
    {
      icon: Globe,
      title: 'Website',
      lines: [contact.website],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative h-[350px] md:h-[450px] overflow-hidden">
          <img
            src={hero.image}
            alt="Contact One Global Logistics"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60 flex items-center">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                  {hero.heading}
                </h1>
                <p className="text-primary-foreground/90 text-base md:text-lg leading-relaxed">
                  {hero.subheading}
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-stretch">

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="h-full"
              >
                <div className="bg-card rounded-2xl p-8 shadow-lg border h-full flex flex-col">
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    Send us a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                    <Input
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="phone"
                      placeholder="Your Phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <Textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="resize-none"
                    />

                    <Button
                      type="submit"
                      className="w-full bg-[#102A56] hover:bg-[#0c2144] text-white font-semibold mt-2"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="h-full"
              >
                <div className="bg-card rounded-2xl p-8 shadow-lg border h-full flex flex-col">
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    Our Office
                  </h2>

                  <div className="space-y-8">
                    {contactInfo.map((info, index) => {
                      const Icon = info.icon;

                      return (
                        <div key={index} className="flex gap-4 items-start">
                          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-primary-foreground" />
                          </div>

                          <div>
                            <h4 className="font-semibold text-primary mb-1">
                              {info.title}
                            </h4>

                            {info.lines.map((line, idx) => {
                              if (info.title === 'Phone') {
                                return (
                                  <a
                                    key={idx}
                                    href={`tel:${line.replace(/[^+\d]/g, '')}`}
                                    className="block text-blue-600 font-medium text-sm hover:text-blue-800 hover:underline transition"
                                  >
                                    {line}
                                  </a>
                                );
                              }

                              if (info.title === 'Email') {
                                return (
                                  <a
                                    key={idx}
                                    href={`mailto:${line}`}
                                    className="block text-blue-600 font-medium text-sm hover:text-blue-800 hover:underline transition"
                                  >
                                    {line}
                                  </a>
                                );
                              }

                              if (info.title === 'Website') {
                                return (
                                  <a
                                    key={idx}
                                    href={`https://${line}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-blue-600 font-medium text-sm hover:text-blue-800 hover:underline transition"
                                  >
                                    {line}
                                  </a>
                                );
                              }

                              return (
                                <p
                                  key={idx}
                                  className="text-muted-foreground text-sm leading-relaxed"
                                >
                                  {line}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Map */}
        <section className="pb-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-2xl shadow-lg border overflow-hidden"
            >
              <div className="relative w-full h-[480px] overflow-hidden rounded-2xl">
                <iframe
                  src={mapEmbedUrl}
                  className="absolute left-0 top-[-52px] w-full h-[540px] border-0"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
