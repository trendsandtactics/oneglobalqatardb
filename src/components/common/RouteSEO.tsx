import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSiteContent, SiteContent } from '@/pages/api';

const SITE_ORIGIN = 'https://www.oneglobalqatar.com';

const PATH_TO_CONTENT_KEY: Record<string, keyof SiteContent> = {
  '/': 'home',
  '/about': 'about',
  '/contact': 'contactPage',
  '/services': 'services',
  '/global-presence': 'globalPresence',
  '/services/air-freight': 'airFreight',
  '/services/ocean-freight': 'oceanFreight',
  '/services/road-freight': 'roadFreight',
  '/services/customs-clearance': 'customsClearance',
  '/services/warehousing': 'warehousing',
  '/services/project-logistics': 'projectLogistics',
};

const ensureMetaTag = (attr: 'name' | 'property', value: string) => {
  let tag = document.querySelector(`meta[${attr}="${value}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, value);
    document.head.appendChild(tag);
  }
  return tag;
};

const ensureCanonicalLink = () => {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  return link;
};

export const RouteSEO = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    let cancelled = false;

    // Admin pages manage their own context; don't override with public SEO.
    if (pathname.startsWith('/admin')) {
      document.title = 'Admin Panel | One Global Logistics Qatar';
      return;
    }

    const fetchAndSetSeo = async () => {
      const siteContent = await getSiteContent();
      if (cancelled) return;

      const pageKey = PATH_TO_CONTENT_KEY[pathname];
      const seoData = pageKey
        ? (siteContent[pageKey] as { seo?: { title: string; description: string; keywords: string } })?.seo
        : null;
      const canonicalUrl = `${SITE_ORIGIN}${pathname}`;

      if (seoData) {
        document.title = seoData.title;
        ensureMetaTag('name', 'description').setAttribute('content', seoData.description);
        ensureMetaTag('name', 'keywords').setAttribute('content', seoData.keywords);
        ensureMetaTag('property', 'og:title').setAttribute('content', seoData.title);
        ensureMetaTag('property', 'og:description').setAttribute('content', seoData.description);
      } else {
        document.title = 'Page Not Found | One Global Logistics Qatar';
        ensureMetaTag('name', 'description').setAttribute('content', 'The page you are looking for could not be found.');
        ensureMetaTag('name', 'keywords').setAttribute('content', '404, page not found');
      }

      ensureCanonicalLink().setAttribute('href', canonicalUrl);
      ensureMetaTag('property', 'og:url').setAttribute('content', canonicalUrl);
    };

    fetchAndSetSeo();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
};
