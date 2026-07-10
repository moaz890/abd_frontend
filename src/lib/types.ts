// ─────────────────────────────────────────────────────────────────────────────
// lib/types.ts
// Central TypeScript interfaces matching the MongoDB data models.
// All field keys MUST match backend Lead schema exactly — do not rename.
// ─────────────────────────────────────────────────────────────────────────────

// ── Lead ──────────────────────────────────────────────────────────────────────
export type LeadStatus = 'new' | 'contacted' | 'closed';
export type LeadState = 'citizen' | 'resident';
export type WorkSector =
  | 'government'
  | 'private_company'
  | 'private_establishment'
  | 'retired';
export type ServiceDuration = 'less_than_3_months' | 'more_than_3_months';

export interface Lead {
  _id: string;
  fullName: string;
  phone: string;
  isQualified: boolean;
  state: LeadState;
  monthlySalary: number;
  monthlyObligations?: number;
  hasRealEstateLoan?: boolean;
  workSector: WorkSector;
  serviceDuration: ServiceDuration;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
}

// ── SiteContent ───────────────────────────────────────────────────────────────
export interface TrustBadge {
  icon: string;
  label: string;
}

export interface HeroContent {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaText: string;
  imageUrl: string;
  trustBadges: TrustBadge[];
}

export interface LeadFormSectionContent {
  badge: string;
  title: string;
  subtitle: string;
  consentText: string;
}

export interface FormLabelsContent {
  fullName: string;
  phone: string;
  ageGroup: string;
  residency: string;
  monthlySalary: string;
  monthlyObligations: string;
  realEstateLoan: string;
  workSector: string;
  serviceDuration: string;
  nextButton: string;
  backButton: string;
  submitButton: string;
  ageQualified: string;
  ageNotQualified: string;
  citizen: string;
  resident: string;
  loanYes: string;
  loanNo: string;
  sectorGovernment: string;
  sectorPrivateCompany: string;
  sectorPrivateEstablishment: string;
  sectorRetired: string;
  durationLess: string;
  durationMore: string;
}

export interface FeatureItem {
  id: string;
  heading: string;
  paragraph: string;
  imageUrl: string;
}

export interface ShopPromoContent {
  imageUrl: string;
  imageAlt: string;
  heading: string;
  subtextBefore: string;
  subtextHighlight: string;
  subtextAfter: string;
  storeUrl: string;
  ctaText: string;
}

export interface FeaturesContent {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  items: FeatureItem[];
  shopPromo: ShopPromoContent;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  avatar_url: string | null;
  rating: number;
  monthsAgo: number;
  order: number;
}

export interface FAQ {
  id: string;
  q: string;
  a: string;
  order: number;
}

export interface FooterContent {
  whatsapp: string;
  email: string;
  tiktok: string;
  snapchat: string;
  crNumber: string;
  taxNumber: string;
  businessCenterNumber: string;
  mapsEmbedUrl: string;
  mapsExternalUrl: string;
  copyrightText: string;
}

export interface SEOContent {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

export interface SuccessPageContent {
  title: string;
  subtitle: string;
  whatsapp?: string;
  whatsappMessage: string;
}

export interface SiteContent {
  _id?: string;
  hero: HeroContent;
  leadFormSection: LeadFormSectionContent;
  formLabels: FormLabelsContent;
  features: FeaturesContent;
  testimonials: Testimonial[];
  faqs: FAQ[];
  footer: FooterContent;
  logoUrl: string;
  seo: SEOContent;
  successPage: SuccessPageContent;
  updatedAt?: string;
}

// ── API response types ─────────────────────────────────────────────────────────
export interface PaginatedLeads {
  leads: Lead[];
  total: number;
  page: number;
  pages: number;
  stats: {
    total: number;
    new: number;
    contacted: number;
    closed: number;
  };
}

export interface ApiError {
  error: string;
  details?: string[];
}

// ── Aliases for component convenience ─────────────────────────────────────────
export type TestimonialItem = Testimonial;
export type FaqItem = FAQ;
export type FeatureItemContent = FeatureItem;
