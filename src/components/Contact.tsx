import { useState } from 'react';
import { MapPin, Phone, Mail, Send, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getSiteContent, defaultContent } from '@/pages/api';

const Contact = () => {
  const { toast } = useToast();

  const { data: siteContent } = useQuery({ queryKey: ['siteContent'], queryFn: getSiteContent });

  const contactSection = siteContent?.home?.contact || defaultContent.home.contact;
  const contact = siteContent?.siteSettings?.contact || defaultContent.siteSettings.contact;
  const bgImage = siteContent?.siteSettings?.contactBgImage || defaultContent.siteSettings.contactBgImage;

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

      if (!response.ok) {
        throw new Error('Failed');
      }

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
    <section
      id="contact"
      className="relative py-20 overflow-hidden min-h-[600px]"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mb-4 drop-shadow-md">
            {contactSection.heading}
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mb-6" />
          <p className="font-body text-muted-foreground max-w-2xl mx-auto drop-shadow-md">
            {contactSection.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Form */}
          <div className="bg-white/90 p-8 rounded-xl shadow-md backdrop-blur-sm animate-slide-in-left">
            <h3 className="font-heading text-xl font-bold text-primary mb-6">
              Send us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full bg-accent hover:bg-red-hover text-accent-foreground font-semibold"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="bg-white/90 p-8 rounded-xl shadow-md backdrop-blur-sm animate-slide-in-right">
            <h3 className="font-heading text-xl font-bold text-primary mb-6">
              Our Office
            </h3>

            <div className="space-y-8">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;

                return (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary-foreground" />
                    </div>

                    <div>
                      <h4 className="font-heading font-semibold text-primary mb-1">
                        {info.title}
                      </h4>

                      {info.lines.map((line, idx) => {
                        if (info.title === 'Phone') {
                          return (
                            <a
                              key={idx}
                              href={`tel:${line.replace(/[^+\d]/g, '')}`}
                              className="block text-blue-600 text-sm font-medium hover:underline hover:text-blue-800 transition"
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
                              className="block text-blue-600 text-sm font-medium hover:underline hover:text-blue-800 transition"
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
                              className="block text-blue-600 text-sm font-medium hover:underline hover:text-blue-800 transition"
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
        </div>
      </div>
    </section>
  );
};

export default Contact;
