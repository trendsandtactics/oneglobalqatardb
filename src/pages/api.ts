const API_BASE = '/api';
const TOKEN_KEY = 'adminToken';

export const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { success: false, error: data.error || 'Login failed' };
    localStorage.setItem(TOKEN_KEY, data.token);
    return { success: true };
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
};

export const logout = () => localStorage.removeItem(TOKEN_KEY);

export const isLoggedIn = (): boolean => !!localStorage.getItem(TOKEN_KEY);

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface Seo {
  title: string;
  description: string;
  keywords: string;
}

interface ServiceBodySection {
  heading: string;
  paragraphs: string[];
  list: string[];
  outro?: string;
}

interface ServiceBody {
  intro: string[];
  sections: ServiceBodySection[];
}

interface ServiceFeature {
  title: string;
  description: string;
}

interface ServicePageContent {
  seo: Seo;
  hero: { image: string; title: string; subtitle: string };
  mainHeading: string;
  body: ServiceBody;
  features: ServiceFeature[];
}

const defaultContent = {
  header: {
    logo: '/onegloballogo.png',
    navLinks: [
      { name: 'Home', href: '#home', isPage: false },
      { name: 'About Us', href: '/about', isPage: true },
      { name: 'Our Services', href: '/services', isPage: true },
      { name: 'Global Presence', href: '/global-presence', isPage: true },
      { name: 'Contact Us', href: '/contact', isPage: true },
    ],
  },

  footer: {
    logo: '/onegloballogo.png',
    aboutBlurb: 'One Global Logistics Services W.L.L is a Qatar based global NVOCC operator providing LCL consolidation services worldwide.',
    copyright: '© 2025 One Global Logistics. All rights reserved.',
    quickLinks: [
      { name: 'Home', id: 'home', isPage: false },
      { name: 'About Us', id: 'about', isPage: false },
      { name: 'Our Services', id: '/services', isPage: true },
      { name: 'Vision & Mission', id: 'vision', isPage: false },
      { name: 'Contact Us', id: 'contact', isPage: false },
    ],
  },

  siteSettings: {
    companyAbout: "One Global Logistics Services W.L.L is a Qatar based global NVOCC (Non-vessel owned common carrier) operator providing LCL consolidation services worldwide markets. We at OGL has a well experienced and established team with relevant experience in their own dedicated trade lanes supports our customers with all their special requirements with complete dedication and transparency. Our commitment to honest, transparent business practice and pricing, backed by a network of experienced and trusted agents, from around the world, makes us one of the fast-growing consolidators based at Qatar. We are well positioned to manage your LCL business with full attention. We aimed at providing the secured end to end LCL services to the Freight Forwarding /Logistics Companies in Qatar, whereas we ensure to maintain the trust and not entertain direct customer business.",
    contact: {
      addressLines: [
        'One Global Logistics Services W.L.L',
        'Office no: 48, 2nd Floor',
        'Al matar Centre, Old Airport Road',
        'Doha, Qatar',
      ],
      phones: ['+974 558 558 36', '+974 446 79 444', '+974 446 79 400'],
      email: 'info@oneglobalqatar.com',
      website: 'www.oneglobalqatar.com',
    },
    social: {
      facebook: 'https://www.facebook.com/oneglobalqatar',
      linkedin: 'https://www.linkedin.com/company/onegloballogistics/?viewAsMember=true',
    },
    contactBgImage: '/about-bg.webp',
  },

  serviceList: {
    items: [
      {
        slug: 'air-freight',
        title: 'Air Freight',
        link: '/services/air-freight',
        image: '/airfreight.jpg',
        points: ['Express & deferred services', 'Airport-to-airport & door-to-door', 'DG & temperature-controlled cargo'],
      },
      {
        slug: 'ocean-freight',
        title: 'Sea Freight',
        link: '/services/ocean-freight',
        image: '/seafreight.jpg',
        points: ['FCL & LCL solutions', 'Breakbulk & Ro-Ro cargo', 'Global consolidation network'],
      },
      {
        slug: 'road-freight',
        title: 'Road Freight',
        link: '/services/road-freight',
        image: '/roadfreight01.jpg',
        points: ['GCC distribution', 'Cross-border trucking', 'Last-mile delivery'],
      },
      {
        slug: 'customs-clearance',
        title: 'Customs Clearance',
        link: '/services/customs-clearance',
        image: '/Customsclearance.jpg',
        points: ['Import & export documentation', 'Free zone & mainland clearance', 'Compliance support'],
      },
      {
        slug: 'warehousing',
        title: 'Warehousing',
        link: '/services/warehousing',
        image: '/Warehousing.jpg',
        points: ['Bonded & non-bonded facilities', 'Inventory management', 'Value-added services'],
      },
      {
        slug: 'project-logistics',
        title: 'Project Logistics',
        link: '/services/project-logistics',
        image: '/Projectlogistics.jpg',
        points: ['Planning & coordination', 'Heavy & OOG cargo', 'End-to-end execution'],
      },
    ],
  },

  countrySelector: {
    items: [
      { country: 'MALAYSIA', company: 'OECL', website: 'https://www.oecl.sg/malaysia/home', priority: 3, flag: '/my.svg' },
      { country: 'SINGAPORE', company: 'GC', website: 'https://www.globalconsol.com/', priority: 2, flag: '/sg.svg' },
      { country: 'INDONESIA', company: 'OECL', website: 'https://www.oecl.sg/indonesia/home', priority: 6, flag: '/id.svg' },
      { country: 'THAILAND', company: 'OECL', website: 'https://www.oecl.sg/thailand/home', priority: 4, flag: '/th.svg' },
      { country: 'MYANMAR', company: 'GC', website: 'https://www.globalconsol.com/myanmar', priority: 5, flag: '/mm.svg' },
      { country: 'AUSTRALIA', company: 'GGL', website: 'https://www.gglaustralia.com', priority: 7, flag: '/au.svg' },
      { country: 'INDIA', company: 'GGL', website: 'https://www.gglindia.com', priority: 7, flag: '/in.svg' },
      { country: 'BANGLADESH', company: 'GC', website: 'https://www.globalconsol.com/bangladesh', priority: 9, flag: '/bd.svg' },
      { country: 'SRI LANKA', company: 'GC', website: 'https://www.globalconsol.com/sri-lanka', priority: 10, flag: '/lk.svg' },
      { country: 'PAKISTAN', company: 'GC', website: 'https://www.globalconsol.com/pakistan', priority: 10, flag: '/pk.svg' },
      { country: 'QATAR', company: 'ONE GLOBAL', website: 'https://oneglobalqatar.com/', priority: 12, flag: '/qa.svg' },
      { country: 'SAUDI ARABIA', company: 'AMASS', website: 'https://amassmiddleeast.com/', priority: 13, flag: '/sa.svg' },
      { country: 'UAE', company: 'AMASS', website: 'https://amassmiddleeast.com/', priority: 14, flag: '/ae.svg' },
      { country: 'USA', company: 'GGL', website: 'https://gglusa.us/', priority: 15, flag: '/us.svg' },
      { country: 'UK', company: 'GGL', website: 'https://ggl.sg/uk', priority: 16, flag: '/gb.svg' },
    ],
  },

  home: {
    seo: {
      title: 'One Global Logistics Qatar | International Freight Forwarding & NVOCC Solutions',
      description: 'One Global Logistics Services W.L.L is a Qatar based global NVOCC operator providing reliable LCL & FCL consolidation, air freight, and logistics solutions worldwide.',
      keywords: 'One Global Logistics Qatar, NVOCC Doha, LCL consolidation, FCL shipping, freight forwarding Qatar',
    },
    hero: {
      messages: [
        'Cost Effective and Top Quality LCL & FCL Services',
        'Top-notch Warehousing Services for all your shipments',
        'Get the Best LCL & FCL Services at Unbeatable Prices',
        'Get the Best Logistics Service at very competitive prices',
      ],
      tagText: 'Trusted Logistics Partner',
      ctaText: 'Our Services',
      ctaLink: '/services',
      videoSrc: '/herone.mp4',
    },
    heroNavButtons: {
      items: [
        { label: 'Consolmate', url: 'https://consolmate.com/auth/login/9' },
        { label: 'Partner Portal', url: 'https://pp.onlinetracking.co/auth/login/9' },
        { label: 'Tracking', url: 'http://ec2-13-229-38-56.ap-southeast-1.compute.amazonaws.com:8081/ords/f?p=107:102:::::P0_GROUP_RID:188' },
        { label: 'Sailing Schedule', url: 'http://ec2-13-229-38-56.ap-southeast-1.compute.amazonaws.com:8081/ords/f?p=107:104:::::P0_GROUP_RID:188' },
      ],
    },
    about: {
      heading: 'About Us',
      image: '/ship.png',
    },
    globalNetwork: {
      heading: 'Our Global Network',
      paragraph: 'ONE Global Logistics services W.L.L has a strong & Reliable Worldwide Agent network . OGL believes in Technology driven Logistic solution to provide a transparent and hassle free service to its agents & Customers.The strength of any organization is its individuals, and we are no different. We have good number of staffs catering to the business needs of the market. The departments are headed by professionals who have many years of experience in the logistics field as a neutral Sea LCL Consolidation Service Provider to serve the QATAR our network guarantees schedule integrity that’s next to none. We have the best transit cycle, reliability, and rates you can find, along with the flexibility you want when it comes to smaller loads.Get in touch with our logistics team at Qatar – ONE GLOBAL LOGISTICS SERVICES now and we shall guarantee timely and professional services.',
      features: [
        { name: 'Consol Mate' },
        { name: 'Partner Portal' },
        { name: 'E-DO' },
        { name: 'Live Tracking' },
        { name: 'Integrated Digital Logistics Platform' },
        { name: 'Cloud Based' },
      ],
    },
    keyFeatures: {
      heading1: 'SEA (LCL & FCL) / AIR FREIGHT - KEY FEATURES',
      heading2: 'OUR SERVICES',
      features: [
        { title: 'Optimize Choices', description: 'Optimum choices with multiple sailings on each tradeline.' },
        { title: 'Consolidation Trucking', description: 'Special Consolidated Trucking options all over Europe.' },
        { title: 'Comprehensive', description: 'We offer a very comprehensive freight management services.' },
        { title: 'Cost Effective', description: 'Cost effective services through well negotiated carrier contracts and schedules.' },
      ],
    },
    visionMission: {
      vision: 'OGL to be the leading global logistics solution provider through our most advanced systems combined with well experienced logistics professionals.',
      mission: 'OGL to be Forwarders first choice for:FCL, LCL, Air Freight, Freight Management Services.',
    },
    coreValues: {
      heading: 'OGL – Digital Logistics',
      paragraph: "It's our solution-based logistics services coupled with the best technology that makes us stand out. We believe in providing the right services using the right tools at the right time.",
      bulletPoints: [
        'Integrated multi logistics platforms',
        'Live end to end supply chain visibility',
        'Customized portals to customer communications',
        'Tools to automate customer communications',
        'Real time business intelligence and reporting',
      ],
      values: [
        { title: 'Strive for excellence' },
        { title: 'Adapt, learn & assimilate the best industry practices' },
        { title: 'Open & honest relationship with communications' },
        { title: 'Embrace innovation' },
      ],
      image: '/port.jpg',
    },
    valuePropositions: {
      heading: 'Freight Management Value Propositions',
      items: [
        { title: 'On-line Booking' },
        { title: 'Auto-alerts with milestone updates for shipments to customers' },
        { title: 'KPI reports with dashboard facility' },
      ],
    },
    contact: {
      heading: 'CONTACT US',
      subheading: 'Get in touch with our team for inquiries, quotes, or any questions about our services.',
    },
  },

  about: {
    seo: {
      title: 'About Us | One Global Logistics Qatar',
      description: 'Learn about One Global Logistics Services W.L.L, a Qatar based global NVOCC operator delivering transparent, trusted LCL consolidation and freight forwarding services.',
      keywords: 'about One Global Logistics, Qatar NVOCC operator, logistics company profile Doha',
    },
    hero: {
      image: '/abouthero.jpg',
      heading: 'About Us',
      subheading: 'Your trusted partner in global logistics solutions',
    },
    about: {
      heading: 'Drive Your Business Forward with OGL',
      image: '/About01.png',
      features: [
        'Global NVOCC Operator',
        'LCL Consolidation Experts',
        'Transparent Pricing',
        'Dedicated Trade Lanes',
        'Secured End-to-End Services',
        'Trusted Agent Network',
      ],
    },
  },

  contactPage: {
    seo: {
      title: 'Contact Us | One Global Logistics Qatar',
      description: 'Get in touch with One Global Logistics Qatar for shipment inquiries, freight quotes, and logistics support in Doha, Qatar.',
      keywords: 'contact One Global Logistics Qatar, Doha freight forwarder contact, logistics inquiry Qatar',
    },
    hero: {
      image: '/port.jpg',
      heading: 'Contact Us',
      subheading: 'Get in touch with our team for inquiries, quotes, or service information.',
    },
    mapEmbedUrl: 'https://www.google.com/maps/d/embed?mid=1x7_4LJ6dtdf7j5_wLKodrqPKOdjmUlw&ehbc=2E312F&noprof=1',
  },

  services: {
    seo: {
      title: 'Our Services | One Global Logistics Qatar',
      description: 'Explore air freight, ocean freight, road freight, customs clearance, warehousing and project logistics services offered by One Global Logistics Qatar.',
      keywords: 'logistics services Qatar, freight forwarding services, customs clearance Doha',
    },
    keyFeatures: {
      heading: 'SEA (LCL & FCL) / AIR FREIGHT – KEY FEATURES',
      features: [
        { title: 'Optimize Orders', description: 'Optimize orders into container shipments for efficient delivery.' },
        { title: 'Consolidation Handling', description: 'Expert consolidation handling for both LCL and FCL shipments.' },
        { title: 'Comprehensive', description: 'We offer comprehensive full container services worldwide.' },
        { title: 'Cost Effective', description: 'Cost-effective solutions tailored for your shipping needs.' },
      ],
    },
    servicesIntro: {
      tag: 'What We Offer',
      heading: 'Explore Our Services',
      subheading: 'Reliable, scalable and technology-driven logistics solutions.',
    },
  },

  globalPresence: {
    seo: {
      title: 'Global Presence | One Global Logistics Qatar',
      description: 'One Global Logistics operates across multiple countries. Discover our worldwide office network spanning Asia, the Middle East, Europe, and the Americas.',
      keywords: 'global logistics network, One Global Logistics offices, worldwide freight forwarding presence',
    },
    mapEmbedUrl: 'https://www.google.com/maps/d/u/0/embed?mid=1d5jZQlEjnKqnsGHvdJWR5wB_-fcQ_Zk&z=2&ll=12.9716,77.5946&hl=en&ehbc=2E312F&output=embed',
    locations: [
      {
        code: 'in', name: 'India', lat: 9.9323, lng: 76.2996,
        cities: [
          { name: 'Kerala', lat: 9.9323, lng: 76.2996, address: 'CC 59/801A Elizabeth Memorial Building, Thevara Ferry Jn, Cochin 682013 , Kerala.', contacts: ['+91 484 4019192 / 93'], email: 'info.india@ggl.sg' },
          { name: 'Mumbai', lat: 19.01123, lng: 73.03715, address: '803 / 804, Shelton Cubix, Plot No. 87, Sector-15,CBD Belapur, Navi Mumbai, Maharastra - 400614.', contacts: ['022-35131688 / 35113475 / 35082586'], email: 'info.india@ggl.sg' },
          { name: 'Mumbai-Andheri', lat: 19.11303, lng: 72.86848, address: '503, Midas, Sahar Plaza Complex,Sir M.V Road,Andheri East, Mumbai 400059', contacts: ['+91 8879756838'], email: 'info.india@ggl.sg' },
          { name: 'Delhi', lat: 28.62748, lng: 77.2221, address: '903, Surya Kiran Building K.G Marg,Connaught Place New Delhi - 110001', contacts: ['+91 11 493224477 / 48 /49'], email: 'info.india@ggl.sg' },
          { name: 'Bangalore', lat: 13.01855, lng: 77.64191, address: '3C-964 IIIrd Cross Street,HRBR LAYOUT 1st Block,Kalayan Nagar Bannaswadi,Bengaluru - 560043.', contacts: ['+91 9841676259'], email: 'info.india@ggl.sg' },
          { name: 'Kolkata', lat: 22.5769, lng: 88.4341, address: 'Merlin Matrix, 3rd floor, Room No. 303 10,D. N. BLOCK, SECTOR - V SALT LAKE CITY, Kolkata – 700091', contacts: ['+91 33 46025458 / 59 / 60/ 61'], email: 'info.india@ggl.sg' },
        ],
      },
      {
        code: 'my', name: 'Malaysia', lat: 1.4842, lng: 103.7629,
        cities: [
          { name: 'PASIRGUDANG', lat: 1.4842, lng: 103.7629, address: 'Unit 20-03A, Level 20 Menara Zurich, 15 Jalan Dato Abdullah Tahir, 80300 Johor Bahru', contacts: ['+603-3319 2778 / 74 / 75, 79'], email: 'info@oecl.sg' },
          { name: 'PORTKLANG', lat: 2.9982, lng: 101.3831, address: 'MTBBT 2, 3A-5, Jalan Batu Nilam 16, The Landmark (Behind AEON Mall), Bandar Bukit Tinggi 2, 41200, Klang, Selangor D.E', contacts: ['+603 - 3319 2778 / 74 / 75'], email: 'info@oecl.sg' },
        ],
      },
      {
        code: 'ae', name: 'United Arab Emirates (UAE)', lat: 25.2048, lng: 55.2708,
        cities: [
          { name: 'Dubai', lat: 25.2048, lng: 55.2708, address: 'Office # 509, Al Nazar Plaza, Oud Metha, Dubai, U.A.E', contacts: ['+971 4 3433388'] },
          { name: 'JEBEL ALI', lat: 24.9857, lng: 55.1436, address: 'Warehouse# Zg06, Near Roundabout 13, North Zone, p. B No: 30821, jebel Ali, Dubai, U.A.E', contacts: ['+971 4 8819787'] },
          { name: 'ABU DHABI', lat: 24.4539, lng: 54.3773, address: 'PB No: 30500, Office 3-1, Unit 101, 1st Floor, Al Jaber Jewellery Building, Al Khalidiya, Abu Dhabi, U.A.E', contacts: ['+971 50 4337214'] },
        ],
      },
      {
        code: 'qa', name: 'Qatar', lat: 25.276987, lng: 51.520008,
        cities: [
          { name: 'Doha', lat: 25.276987, lng: 51.520008, address: 'Office no: 48, 2nd Floor, Al matar Centre, Old Airport Road Doha', contacts: ['0974 33622555'] },
        ],
      },
      {
        code: 'sa', name: 'Saudi Arabia', lat: 26.4207, lng: 50.0888,
        cities: [
          { name: 'Dammam', lat: 26.4207, lng: 50.0888, address: 'Building No.2817, Secondary No9403, King Faisal Road, Al Tubebayshi Dist, Dammam, KSA 32233', contacts: ['+966 13 343 0003'] },
          { name: 'Riyadh', lat: 24.7136, lng: 46.6753, address: 'Room No. T18, Rail Business Centre, Bldg No. 3823, Omar Aimukhtar St, Thulaim, Riyadh 11332', contacts: ['+966 11295 0020'] },
          { name: 'Jeddah', lat: 21.4858, lng: 39.1925, address: 'Al-Madinah Al-Munawarah Road, Al Sharafeyah, Jeddah 4542 -22234, Kingdom of Saudi Arabia', contacts: ['+966 12 578 0874'] },
        ],
      },
      {
        code: 'sg', name: 'Singapore', lat: 1.3521, lng: 103.8198,
        cities: [
          { name: 'Singapore', lat: 1.3521, lng: 103.8198, address: 'Blk 511 Kampong Bahru Road, #03-01 Keppel Distripark, Singapore - 099447', contacts: ['+ 65 69084188'], email: 'info.sg@globalconsol.com ,june@ggl.sg' },
        ],
      },
      {
        code: 'id', name: 'Indonesia', lat: -6.2088, lng: 106.8456,
        cities: [
          { name: 'Jakarta', lat: -6.2088, lng: 106.8456, address: '408, Lina Building, JL.HR Rasuna Said kav B7, Jakarta', contacts: ['+62 21 529 20292, 522 4887'], email: 'logistics.jkt@oecl.sg' },
          { name: 'Surabaya', lat: -7.2575, lng: 112.7521, address: 'Japfa Indoland Center, Japfa Tower 1, Lantai 4/401-A JL Jend, Basuki Rahmat 129-137, Surabaya 60271', contacts: ['+62 21 529 20292, 522 4887'], email: 'logistics.jkt@oecl.sg' },
        ],
      },
      {
        code: 'lk', name: 'Sri Lanka', lat: 6.9271, lng: 79.8612,
        cities: [
          { name: 'Colombo', lat: 6.9271, lng: 79.8612, address: 'Ceylinco House, 9th Floor, No. 69, Janadhipathi Mawatha, Colombo 01,  Lanka', contacts: ['+94 114477499', '+94 114477494 / 98'], email: 'info.cmb@globalconsol.com' },
        ],
      },
      {
        code: 'th', name: 'Thailand', lat: 13.72957, lng: 100.53095,
        cities: [
          { name: 'Bangkok', lat: 13.72957, lng: 100.53095, address: '109 CCT Building, 3rd Floor, Rm.3, Surawong Road, Suriyawongse, Bangrak, Bangkok 10500 109', contacts: ['+662-634-3240', '+662-634-3942'], email: 'info@oecl.sg' },
        ],
      },
      {
        code: 'mm', name: 'Myanmar', lat: 16.8409, lng: 96.1735,
        cities: [
          { name: 'Yangon', lat: 16.8409, lng: 96.1735, address: 'No.608, Room 8B, Bo Soon Pat Tower, Merchant Street, Pabedan Township, Yangon, Myanmar', contacts: ['+951 243158', '+951 377985, 243101'], email: 'info@globalconsol.com' },
        ],
      },
      {
        code: 'bd', name: 'Bangladesh', lat: 23.8103, lng: 90.4125,
        cities: [
          { name: 'Dhaka', lat: 23.8103, lng: 90.4125, address: 'ID #9-N (New), 9-M(Old-N), 9th floor, Tower 1, Police Plaza Concord No.2, Road # 144, Gulshan Model Town, Dhaka 1215, Bangladesh', contacts: ['+880 1716 620989'], email: 'info@globalconsol.com' },
        ],
      },
      {
        code: 'pk', name: 'Pakistan', lat: 24.8608, lng: 67.0097,
        cities: [
          { name: 'Karachi', lat: 24.8608, lng: 67.0097, address: 'Suite No. 507 & 508, 5th Floor Fortune Center, Block-6, P.E.C.H.S, Shahrah-e-Faisal, Karachi, Pakistan', contacts: ['+92 21 34542881/ +92 21 34542882/ +92 21 34542883/ +92 21 34542884'], email: 'info.pk@ggl.sg' },
          { name: 'Lahore', lat: 31.5204, lng: 74.3487, address: 'Office # 301, 3rd Floor, Gulberg Arcade Main Market, Gulberg 2, Lahore, Pakistan', contacts: ['+92 42-35782306/07/08'], email: 'info.pk@globalconsol.com' },
        ],
      },
      {
        code: 'us', name: 'United States (USA)', lat: 41.8622, lng: -87.7209,
        cities: [
          { name: 'Chicago', lat: 41.8622, lng: -87.7209, address: '939 W. North Avenue, Suite 750, Chicago, IL 60642', contacts: ['+1 847 254 7320'], email: 'info@gglusa.us' },
          { name: 'New York', lat: 37.4545, lng: -122.1818, address: 'New Jersey Branch, 33 Wood Avenue South Suite 600, Iselin, NJ 08830', contacts: ['+1 732 456 6780'], email: 'info@gglusa.us' },
          { name: 'Los Angeles', lat: 40.5330, lng: -74.3481, address: '2250 South Central Avenue Compton, CA 90220', contacts: ['+1 310 928 3903'], email: 'info@gglusa.us' },
        ],
      },
      {
        code: 'gb', name: 'United Kingdom (UK)', lat: 51.5074, lng: -0.1278,
        cities: [
          { name: 'London', lat: 51.5074, lng: -0.1278, address: '167-169 Great Portland Street 5th Floor, London W1W 5PF, United Kingdom', contacts: ['+44 (0) 203 393 9508'] },
        ],
      },
      {
        code: 'au', name: 'Australia', lat: -37.7064, lng: 144.8503,
        cities: [
          { name: 'Melbourne', lat: -37.7064, lng: 144.8503, address: 'Suite 5, 7-9 Mallet Road, Tullamarine, Victoria, 3043', contacts: ['Mob: +61 432254969', 'Tel: +61 388205157'], email: 'info@gglaustralia.com' },
        ],
      },
    ],
  },

  airFreight: {
    seo: {
      title: 'Air Freight Services | One Global Logistics Qatar',
      description: 'Fast and reliable air freight solutions for time-sensitive cargo. Global air freight forwarding services from One Global Logistics Qatar.',
      keywords: 'air freight Qatar, air cargo Doha, express air shipping',
    },
    hero: { image: '/airfreight.jpg', title: 'Air Freight Solutions', subtitle: 'Tailored air freight solutions to meet your unique requirements' },
    mainHeading: 'Comprehensive Air Freight Services',
    body: {
      intro: [
        'At One Global Logistics, we offer a comprehensive range of air freight services designed to meet all your shipping needs. Our expert air freight teams provide seamless air import, export, and express options, all on a convenient door-to-door basis.',
        'Global Reach with Strategic Hubs: With a strong presence in key transshipment hubs such as Singapore, Malaysia, Sri Lanka, and Dubai, we ensure reliable and timely air freight services worldwide.',
      ],
      sections: [
        {
          heading: 'Comprehensive Air Freight Solutions:',
          paragraphs: [],
          list: [
            'Import & Export Shipments: Handling shipments to and from major international destinations.',
            'Express Services: Fast-track options for time-sensitive deliveries.',
            'Consolidation Services: Combining smaller shipments to optimize costs and efficiency.',
          ],
        },
      ],
    },
    features: [
      { title: 'Time-Definite Deliveries', description: 'Flexible options including next-flight-out, express, and deferred services to meet critical timelines.' },
      { title: 'Cargo Consolidation', description: 'Efficient consolidation services to optimize costs and reduce handling time.' },
      { title: 'Specialized Handling', description: 'Capabilities to manage high-value, sensitive, or perishable cargo with care and compliance.' },
      { title: 'Real-Time Shipment Tracking', description: 'Full visibility and status updates through integrated tracking systems.' },
      { title: 'Customs Clearance Support', description: 'End-to-end handling of documentation, customs brokerage, and compliance to streamline international transit.' },
    ],
  } as ServicePageContent,

  oceanFreight: {
    seo: {
      title: 'Ocean Freight Services | One Global Logistics Qatar',
      description: 'Cost-effective ocean freight solutions including FCL and LCL consolidation services from One Global Logistics Qatar.',
      keywords: 'ocean freight Qatar, FCL LCL Doha, sea freight forwarding',
    },
    hero: { image: '/seafreight.jpg', title: 'Ocean Freight Solutions', subtitle: 'Cost-effective and reliable ocean freight services worldwide' },
    mainHeading: 'Ocean Freight Services',
    body: {
      intro: [
        "At One Global Logistics, we specialize in delivering comprehensive ocean freight solutions tailored to meet the diverse requirements of our clients. Whether you're shipping bulk cargo or small consignments, our services are built for efficiency, reliability, and cost-effectiveness.",
      ],
      sections: [
        {
          heading: 'Full Container Load (FCL)',
          paragraphs: ['For businesses with substantial cargo volumes, our FCL services offer dedicated container space, ensuring direct and secure transportation from port to port. This option is ideal for shipments that require exclusive container space, providing flexibility and control over delivery schedules.'],
          list: [],
        },
        {
          heading: 'Less than Container Load (LCL) Consolidation',
          paragraphs: ['Recognizing the need for cost-effective solutions for smaller shipments, we offer LCL consolidation services. This service allows multiple shippers to share container space, reducing costs while maintaining the safety and integrity of each shipment. Our strategic presence in key transshipment hubs ensures timely and efficient consolidation services.'],
          list: [],
        },
      ],
    },
    features: [
      { title: 'Global Ocean Network', description: 'Strong carrier partnerships ensuring reliable global ocean freight services.' },
      { title: 'FCL & LCL Options', description: 'Flexible full container and consolidation shipping solutions.' },
      { title: 'Breakbulk Cargo', description: 'Specialized handling for oversized and heavy cargo.' },
      { title: 'Door-to-Door Services', description: 'Complete logistics coverage from origin to destination.' },
    ],
  } as ServicePageContent,

  roadFreight: {
    seo: {
      title: 'Road Freight & Transportation | One Global Logistics Qatar',
      description: 'Reliable domestic and cross-border road freight and distribution services from One Global Logistics Qatar.',
      keywords: 'road freight Qatar, transportation Doha, GCC trucking',
    },
    hero: { image: '/roadfreight.jpg', title: 'Transportation & Distribution', subtitle: 'Reliable domestic and international transportation services' },
    mainHeading: 'TRANSPORTATION & DISTRIBUTION',
    body: {
      intro: [
        'At One Global Logistics, we understand that efficient transportation and distribution are the backbone of a seamless supply chain. Our dedicated fleet and robust infrastructure ensure that your goods reach their destination on time, every time.',
      ],
      sections: [
        {
          heading: 'Domestic Distribution Network',
          paragraphs: ['With a strategically located network of offices in Mumbai, New Delhi, Kolkata, Bangalore, and Chennai, One Global Logistics offers comprehensive domestic transportation solutions. Our fleet is equipped to handle various cargo types, ensuring safe and timely deliveries across the country.'],
          list: [],
        },
        {
          heading: 'Fleet & Operational Excellence',
          paragraphs: ['Our fleet comprises a diverse range of vehicles, including:'],
          list: [
            'Full Truck Load (FTL)',
            'Less than Truck Load (LTL)',
            'Refrigerated Vehicles (for temperature-sensitive goods)',
            'Flatbed Trucks (for oversized cargo)',
          ],
          outro: 'Each vehicle is maintained to the highest standards, ensuring reliability and safety during transit.',
        },
        {
          heading: 'Distribution Services',
          paragraphs: [],
          list: [
            'Last-Mile Delivery: Ensuring timely deliveries to end customers.',
            'Cross-Docking: Minimizing storage time and speeding up the distribution process.',
            'Milk Run Services: Efficient collection and delivery from multiple suppliers to a single destination.',
          ],
        },
      ],
    },
    features: [
      { title: 'Diverse Fleet', description: 'FTL, LTL, refrigerated & flatbed options' },
      { title: 'Pan-India Coverage', description: 'Strategically located network across major hubs' },
      { title: 'Safe Handling', description: 'Secure cargo management and operational excellence' },
      { title: 'On-Time Delivery', description: 'Reliable domestic distribution network' },
    ],
  } as ServicePageContent,

  customsClearance: {
    seo: {
      title: 'Customs Clearance Services | One Global Logistics Qatar',
      description: 'Expert customs clearance solutions for seamless import and export border crossings in Qatar.',
      keywords: 'customs clearance Qatar, import export clearance Doha, trade compliance',
    },
    hero: { image: '/Customsclearance.jpg', title: 'Customs Clearance Solutions', subtitle: 'Expert solutions for seamless border crossings and trade compliance' },
    mainHeading: 'Customs Clearance Solutions',
    body: {
      intro: [
        'Navigating the complexities of global trade is simplified with our expert customs clearance services. We ensure your shipments move smoothly across borders, handling all aspects of the process from accurate documentation and tariff classification to regulatory compliance and specialized cargo handling.',
        'Our experienced team stays abreast of evolving regulations, leverages advanced technology for expedited clearance, and maintains strong relationships with customs authorities worldwide. We prioritize transparency and open communication, providing real-time updates and peace of mind, allowing you to focus on your core business.',
      ],
      sections: [
        {
          heading: 'Import Clearance',
          paragraphs: ['Our import clearance services streamline the process of bringing goods into the country, ensuring compliance with local regulations and minimizing delays.'],
          list: ['Duty and tax calculation', 'Entry preparation and filing', 'Tariff classification', 'Customs examination support'],
        },
        {
          heading: 'Export Clearance',
          paragraphs: ['Our export clearance services ensure your goods leave the country efficiently, with all necessary documentation and compliance requirements met.'],
          list: ['Export documentation preparation', 'License and permit management', 'Security filing and compliance', 'Electronic export information filing'],
        },
      ],
    },
    features: [
      { title: 'Documentation Expertise', description: 'Our team ensures all your customs documentation is accurate, complete, and submitted correctly.' },
      { title: 'Regulatory Compliance', description: 'Stay compliant with constantly evolving international trade regulations.' },
      { title: 'Expert Consultation', description: 'Our customs experts provide guidance on duty and tax implications.' },
      { title: 'Global Network', description: 'Strong relationships with customs authorities worldwide for expedited clearance.' },
    ],
  } as ServicePageContent,

  warehousing: {
    seo: {
      title: 'Warehousing & Distribution | One Global Logistics Qatar',
      description: 'Strategic warehousing and distribution solutions to optimize your supply chain, from One Global Logistics Qatar.',
      keywords: 'warehousing Qatar, distribution Doha, bonded warehouse',
    },
    hero: { image: '/Warehousing.jpg', title: 'Warehousing Solutions', subtitle: 'Comprehensive warehousing services designed to streamline your supply chain' },
    mainHeading: '',
    body: {
      intro: [],
      sections: [
        {
          heading: 'Tailored Warehousing Services',
          paragraphs: [
            'General Cargo Storage: Secure and organized storage solutions for various types of goods.',
            'Temperature-Controlled Storage: Specialized facilities for perishable and sensitive items.',
            'Bonded Warehousing: Storage solutions that allow goods to be stored without the payment of customs duties until they are released.',
          ],
          list: [],
        },
        {
          heading: 'Value-Added Services',
          paragraphs: [
            'Inventory Management: Real-time tracking and management of stock levels.',
            'Pick & Pack: Efficient order fulfilment services to meet customer demands.',
            'Consolidation & Deconsolidation: Combining or separating shipments to optimize logistics.',
            'Order Processing: Streamlined handling of orders from receipt to dispatch.',
          ],
          list: [],
        },
      ],
    },
    features: [
      { title: 'Secure Facilities', description: '24/7 security and surveillance for all stored goods.' },
      { title: 'Temperature Control', description: 'Climate-controlled storage for sensitive items.' },
      { title: 'Flexible Space', description: 'Scalable storage solutions that grow with your business.' },
      { title: 'Real-Time Tracking', description: 'Advanced inventory systems for complete visibility.' },
    ],
  } as ServicePageContent,

  projectLogistics: {
    seo: {
      title: 'Project Logistics | One Global Logistics Qatar',
      description: 'Specialized project cargo and heavy-lift logistics solutions for complex shipments from One Global Logistics Qatar.',
      keywords: 'project logistics Qatar, heavy lift cargo Doha, oversized cargo shipping',
    },
    hero: { image: '/Projectlogistics.jpg', title: 'Project Logistics', subtitle: 'Specialized solutions for oversized and complex cargo movements' },
    mainHeading: '',
    body: {
      intro: [],
      sections: [
        {
          heading: 'Specialized Project Cargo Handling',
          paragraphs: ['At One Global Logistics, we handle oversized, heavy-lift and complex project cargo with expert planning and precision execution across multiple industries.'],
          list: [],
        },
        {
          heading: 'Project Logistics Capabilities',
          paragraphs: [
            'Heavy Lift Cargo: Specialized handling of extremely heavy machinery and equipment.',
            'Oversized Cargo: Custom routing, permits and solutions for out-of-gauge shipments.',
            'Break Bulk Cargo: Safe handling of non-containerized shipments.',
            'Multimodal Transport: Optimized coordination across road, rail, sea and air.',
            'On-site Services: Loading, positioning and installation support at project locations.',
          ],
          list: [],
        },
        {
          heading: 'Our Project Management Approach',
          paragraphs: [
            'Planning & Engineering: Route surveys and feasibility studies.',
            'Permits & Documentation: Regulatory approvals and compliance handling.',
            'Equipment Selection: Choosing the right lifting and transport tools.',
            'Execution & Monitoring: Real-time supervision for safe delivery.',
          ],
          list: [],
        },
      ],
    },
    features: [
      { title: 'Complex Cargo', description: 'Expert handling of oversized, heavy-lift, and out-of-gauge shipments.' },
      { title: 'Custom Solutions', description: 'Tailored logistics plans designed for unique project requirements.' },
      { title: 'End-to-End Management', description: 'Complete project coordination from planning to final delivery.' },
      { title: 'Risk Mitigation', description: 'Comprehensive insurance and safety protocols protecting your investment.' },
    ],
  } as ServicePageContent,
};

export type SiteContent = typeof defaultContent;

const deepMerge = (target: any, source: any): any => {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (Array.isArray(target[key]) && !Array.isArray(source[key])) {
      output[key] = target[key];
    } else if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] ?? {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
};

export const getSiteContent = async (): Promise<SiteContent> => {
  try {
    const res = await fetch(`${API_BASE}/content`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && typeof data === 'object') {
      return deepMerge(defaultContent, data) as SiteContent;
    }
  } catch (err) {
    console.error('Failed to load content from API:', err);
  }
  return defaultContent;
};

export const updateSiteContent = async (content: SiteContent): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(`${API_BASE}/content`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(content),
    });
    if (res.status === 401) logout();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { success: true };
  } catch (err) {
    console.error('Failed to save content:', err);
    return { success: false };
  }
};

export const getPageContent = async <T extends keyof SiteContent>(page: T): Promise<SiteContent[T]> => {
  try {
    const res = await fetch(`${API_BASE}/content/${String(page)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && typeof data === 'object') {
      return deepMerge(defaultContent[page], data);
    }
  } catch (err) {
    console.error(`Failed to load content for page "${String(page)}":`, err);
  }
  return defaultContent[page];
};

export const updatePageContent = async <T extends keyof SiteContent>(
  page: T,
  content: SiteContent[T]
): Promise<{ success: boolean }> => {
  try {
    const res = await fetch(`${API_BASE}/content/${String(page)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(content),
    });
    if (res.status === 401) logout();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { success: true };
  } catch (err) {
    console.error(`Failed to save content for page "${String(page)}":`, err);
    return { success: false };
  }
};

export const resetToDefaults = async (): Promise<void> => {
  await updateSiteContent(defaultContent);
};

export { defaultContent };
