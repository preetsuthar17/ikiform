// Constants for forms management
import type { AISuggestion } from '../types';

export const AI_FORM_SUGGESTIONS: AISuggestion[] = [
  {
    title: 'Contact Form',
    prompt:
      'Create a contact form with name, email, phone number, and message fields',
  },
  {
    title: 'Customer Feedback',
    prompt:
      'Create a customer feedback form with rating stars, satisfaction level, and comments',
  },
  {
    title: 'Event Registration',
    prompt:
      'Create an event registration form with participant name, email, phone, dietary preferences, and emergency contact',
  },
  {
    title: 'Job Application',
    prompt:
      'Create a job application form with personal details, work experience, education, skills, and resume upload',
  },
  {
    title: 'Survey Form',
    prompt:
      'Create a survey form with multiple choice questions, rating scales, and text responses',
  },
  {
    title: 'Order Form',
    prompt:
      'Create an order form with product selection, quantity, customer details, and payment information',
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
