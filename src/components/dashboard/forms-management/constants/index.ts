import type { AISuggestion } from '../types';

export const AI_FORM_SUGGESTIONS: AISuggestion[] = [
  {
    title: 'Simple Email Waitlist',
    summary: 'Minimal waitlist signup with just email and join button',
    prompt: `Create a simple waitlist form with just an email field (required, large size, full width) and "Join Waitlist" button. Use minimal theme, rate limit 3 per 30 minutes, success message "You're on the list! We'll notify you when we launch. 🚀"`,
  },
  {
    title: 'Party Invitation RSVP',
    summary: 'Fun party RSVP with guest count and dietary preferences',
    prompt:
      'Create a party RSVP form with: guest name, email, RSVP status (Yes/Maybe/No radio), number of guests (1-6), dietary restrictions (checkboxes), song requests (tags field), and comments. Use fun colorful theme, rate limit 2 per hour.',
  },
  {
    title: 'Event Registration',
    summary: 'Professional conference/workshop registration',
    prompt:
      'Create event registration form with: personal details (name, email, phone, company), session preferences, meal preferences, emergency contact, t-shirt size. Multi-step layout, professional theme, rate limit 5 per 10 minutes.',
  },
  {
    title: 'Product Waitlist Signup',
    summary: 'Early access waitlist with user preferences',
    prompt:
      'Create product waitlist with: name, email, product interests (checkboxes), company size, industry, beta testing interest. Include referral source tracking. Modern tech theme, rate limit 3 per 30 minutes.',
  },
  {
    title: 'Event Feedback Survey',
    summary: 'Post-event feedback with ratings and suggestions',
    prompt:
      'Create feedback survey with: overall rating (1-5 stars), venue rating (slider 1-10), content quality rating, most/least valuable aspects (text areas), improvement suggestions, recommendation likelihood (NPS 0-10). Clean survey theme.',
  },
  {
    title: 'E-commerce Order Form',
    summary: 'Complete checkout form with product selection',
    prompt:
      'Create order form with: product selection, quantity, customer info, shipping address, billing info, payment method, shipping options. Multi-step checkout, secure theme, rate limit 5 per 10 minutes.',
  },
  {
    title: 'Job Application Form',
    summary: 'Professional application with experience details',
    prompt:
      'Create job application with: personal info, position details, salary expectations, work experience, skills (tags), education, availability. Multi-step form, professional theme, rate limit 3 per day.',
  },
  {
    title: 'Customer Feedback Form',
    summary: 'Service feedback with satisfaction ratings',
    prompt:
      'Create customer feedback with: overall experience (1-5 stars), staff rating, service details, what went well/needs improvement (text areas), customer type, contact preferences, NPS rating. Enable profanity filter.',
  },
  {
    title: 'Newsletter Subscription',
    summary: 'Email signup with preferences and frequency',
    prompt:
      'Create newsletter signup with: email, name, content interests (checkboxes), email frequency, industry, company size, language preference. Include GDPR checkbox. Clean minimal theme, rate limit 2 per hour.',
  },
  {
    title: 'Support Ticket Form',
    summary: 'Technical support request with categorization',
    prompt:
      'Create support form with: contact info, issue category, priority level, detailed description, steps to reproduce, technical info (OS, browser), urgency reason. Professional support theme, rate limit 10 per hour.',
  },
  {
    title: 'Contest Entry Form',
    summary: 'Competition entry with rules acceptance',
    prompt:
      'Create contest form with: participant info, entry details, social media handles, age confirmation (18+), rules acceptance, terms agreement. Vibrant contest theme, rate limit 3 per contest, enable profanity filter.',
  },
  {
    title: 'Medical Appointment',
    summary: 'Healthcare appointment booking with patient info',
    prompt:
      'Create appointment form with: patient info, insurance details, appointment type, preferred date/time, medical history, current symptoms, pain level (slider 0-10). Multi-step, HIPAA compliant, rate limit 5 per 30 minutes.',
  },
  {
    title: 'Real Estate Inquiry',
    summary: 'Property interest form with buyer preferences',
    prompt:
      'Create real estate inquiry with: contact info, property preferences (type, price range, bedrooms), location preferences, buyer profile, must-have features, viewing availability. Professional real estate theme.',
  },
  {
    title: 'Contact Form',
    summary: 'Basic business contact form with message',
    prompt:
      'Create contact form with: name, email, phone (optional), company, subject dropdown, message (required, 10-500 chars), privacy policy checkbox. Professional theme, rate limit 3 per 30 minutes.',
  },
  {
    title: 'Survey Form',
    summary: 'Flexible survey with multiple question types',
    prompt:
      'Create survey with: demographics, multiple choice questions, rating scales (1-5 stars), NPS questions (0-10 slider), open-ended text responses. Include progress indicator, single column layout.',
  },
];

export const DEFAULT_DELETE_MODAL_STATE = {
  open: false,
  formId: '',
  formTitle: '',
};

export const SKELETON_FORM_COUNT = 6;
export const SKELETON_STATS_COUNT = 3;
export const SKELETON_BUTTONS_COUNT = 5;
