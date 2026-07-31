import { JobServiceListing } from '../types';

export const INITIAL_JOBS_SERVICES: JobServiceListing[] = [
  {
    id: 'job_serv_1',
    posterId: 'user_1',
    posterUsername: 'Alex_Tech',
    posterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    posterRating: 4.9,
    type: 'service_offered',
    title: 'Full Stack Web & Mobile App Development',
    category: 'Tech & Software',
    description: 'Professional software developer with 6+ years experience. Building responsive React/TypeScript web apps, Node.js REST APIs, and iOS/Android mobile apps. Open for fixed-price projects or contract hire.',
    requirements: [
      'Custom web and mobile apps',
      'API integrations & Database architecture',
      'Speed optimization & Bug fixes'
    ],
    payRate: '$60 / hr or Fixed Quote',
    payType: 'Hourly',
    isRemote: true,
    location: {
      country: 'Canada',
      province: 'Ontario',
      city: 'Toronto',
      address: 'Central District',
      postalCode: 'M5B 1T8'
    },
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    skills: ['React', 'TypeScript', 'Node.js', 'Tailwind', 'Mobile Development'],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    urgency: 'Standard',
    status: 'active',
    applicantCount: 5,
    viewsCount: 142
  },
  {
    id: 'job_serv_2',
    posterId: 'user_2',
    posterUsername: 'Sophia_Vintage',
    posterAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    posterRating: 4.8,
    type: 'job_opening',
    title: 'Senior Graphic Designer for E-Commerce Rebrand',
    category: 'Creative & Design',
    description: 'Looking for a talented UI/Visual designer to create brand guidelines, custom product icons, packaging artwork, and social media templates for our vintage lifestyle shop.',
    requirements: [
      'Proven portfolio in brand design & vector artwork',
      'Proficiency in Figma and Adobe Illustrator',
      'Ability to complete within 3 weeks'
    ],
    payRate: '$1,800 Fixed',
    payType: 'Fixed Price',
    isRemote: true,
    location: {
      country: 'United States',
      province: 'California',
      city: 'Los Angeles',
      address: 'Sunset Boulevard',
      postalCode: '90210'
    },
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
    skills: ['Figma', 'Branding', 'Vector Art', 'Logo Design', 'Illustrator'],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    urgency: 'Urgent',
    status: 'active',
    applicantCount: 8,
    viewsCount: 210
  },
  {
    id: 'job_serv_3',
    posterId: 'user_3',
    posterUsername: 'Liam_Audio',
    posterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    posterRating: 5.0,
    type: 'service_offered',
    title: 'Licensed Electrician - Emergency Repairs & EV Chargers',
    category: 'Home Services & Repairs',
    description: 'Certified master electrician offering residential electrical troubleshooting, circuit breaker upgrades, EV charger installations, lighting installs, and home safety inspections.',
    requirements: [
      'Licensed & Insured',
      'Same-day emergency response available',
      'Free upfront cost estimate'
    ],
    payRate: '$75 / hr',
    payType: 'Hourly',
    isRemote: false,
    location: {
      country: 'United Kingdom',
      province: 'Greater London',
      city: 'London',
      address: '221B Baker Street',
      postalCode: 'NW1 6XE'
    },
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800',
    skills: ['Electrical Wiring', 'EV Charger Installation', 'Circuit Breakers', 'Lighting'],
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    urgency: 'Standard',
    status: 'active',
    applicantCount: 12,
    viewsCount: 380
  },
  {
    id: 'job_serv_4',
    posterId: 'user_4',
    posterUsername: 'Elena_Kicks',
    posterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    posterRating: 4.7,
    type: 'job_opening',
    title: 'Weekend Event Photographer Needed for Product Launch',
    category: 'Events & Hospitality',
    description: 'Seeking an energetic event photographer for a 4-hour evening product launch party. Need 50+ edited high-resolution digital photos delivered within 48 hours.',
    requirements: [
      'Professional camera kit & low-light flash',
      'Experience with corporate/lifestyle events',
      'Quick turn-around on photo editing'
    ],
    payRate: '$400 Fixed',
    payType: 'Fixed Price',
    isRemote: false,
    location: {
      country: 'Germany',
      province: 'Bavaria',
      city: 'Munich',
      address: 'Maximilianstrasse',
      postalCode: '80331'
    },
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
    skills: ['Event Photography', 'Lightroom', 'Portraiture', 'Flash Photography'],
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    urgency: 'Urgent',
    status: 'active',
    applicantCount: 4,
    viewsCount: 165
  },
  {
    id: 'job_serv_5',
    posterId: 'user_1',
    posterUsername: 'Alex_Tech',
    posterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    posterRating: 4.9,
    type: 'service_offered',
    title: 'Dog Walking & Gentle In-Home Pet Sitting',
    category: 'Caregiving & Pets',
    description: 'Lifelong pet owner and experienced dog trainer. Offering 30/60 minute neighborhood dog walks, feeding, playtime, and overnight house/pet sitting with daily photo updates.',
    requirements: [
      'First-aid certified for pets',
      'Flexible scheduling 7 days a week',
      'References available upon request'
    ],
    payRate: '$25 / walk',
    payType: 'Hourly',
    isRemote: false,
    location: {
      country: 'Canada',
      province: 'Ontario',
      city: 'Toronto',
      address: 'Yonge & Bloor',
      postalCode: 'M4W 1A1'
    },
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800',
    skills: ['Pet Care', 'Dog Walking', 'Pet Sitting', 'Animal Behavior'],
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    urgency: 'Flexible',
    status: 'active',
    applicantCount: 9,
    viewsCount: 290
  },
  {
    id: 'job_serv_6',
    posterId: 'user_2',
    posterUsername: 'Sophia_Vintage',
    posterAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    posterRating: 4.8,
    type: 'job_opening',
    title: 'High School Math & SAT College Prep Tutor',
    category: 'Tutoring & Education',
    description: 'Looking for a patient, experienced math tutor for a 10th-grade student struggling with Algebra II and preparing for early SAT prep. 2 sessions per week (Online or In-Person).',
    requirements: [
      'Degree in Math, STEM, or Education preferred',
      'Proven track record of SAT score increases',
      'Patient and interactive teaching style'
    ],
    payRate: '$45 / hr',
    payType: 'Hourly',
    isRemote: true,
    location: {
      country: 'United States',
      province: 'California',
      city: 'Los Angeles',
      address: 'Westwood',
      postalCode: '90024'
    },
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    skills: ['Mathematics', 'Algebra', 'SAT Prep', 'Tutoring'],
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    urgency: 'Standard',
    status: 'active',
    applicantCount: 6,
    viewsCount: 178
  }
];
