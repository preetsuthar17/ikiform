import {
  BarChart3,
  Calendar,
  CheckSquare,
  ChevronDown,
  Circle,
  Clock,
  Hash,
  Link2,
  Mail,
  MapPin,
  MessageSquare,
  PenLine,
  Phone,
  Share2,
  Sliders,
  Star,
  Tags,
  Type,
} from 'lucide-react';
import type { FieldTypeConfig } from '../types';

export const FIELD_TYPES: FieldTypeConfig[] = [
  {
    type: 'text',
    label: 'Text Input',
    icon: Type,
    description: 'Single line text input',
  },
  {
    type: 'email',
    label: 'Email',
    icon: Mail,
    description: 'Email address input',
  },
  {
    type: 'statement',
    label: 'Statement',
    icon: MessageSquare,
    description: 'Show a heading, intro, or description in your form.',
  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: MessageSquare,
    description: 'Multi-line text input',
  },
  {
    type: 'number',
    label: 'Number',
    icon: Hash,
    description: 'Numeric input',
  },
  {
    type: 'select',
    label: 'Select Dropdown',
    icon: ChevronDown,
    description: 'Choose from dropdown options',
  },
  {
    type: 'radio',
    label: 'Radio Buttons',
    icon: Circle,
    description: 'Choose one option',
  },
  {
    type: 'checkbox',
    label: 'Checkboxes',
    icon: CheckSquare,
    description: 'Choose multiple options',
  },
  {
    type: 'slider',
    label: 'Slider',
    icon: Sliders,
    description: 'Select value with slider',
  },
  {
    type: 'tags',
    label: 'Tag Input',
    icon: Tags,
    description: 'Enter multiple tags',
  },
  {
    type: 'social',
    label: 'Social Media',
    icon: Share2,
    description: 'Add social media links',
  },
  {
    type: 'date',
    label: 'Date',
    icon: Calendar,
    description: 'Date input (calendar)',
  },
  {
    type: 'time',
    label: 'Time',
    icon: Clock,
    description: 'Select or type a time (HH:MM AM/PM)',
  },
  {
    type: 'scheduler',
    label: 'Scheduler',
    icon: Calendar,
    description: 'Embed a scheduling link (cal.com, Calendly, etc.)',
  },
  {
    type: 'signature',
    label: 'Signature',
    icon: PenLine,
    description: 'Digital signature input (draw with mouse or touch)',
  },
  {
    type: 'poll',
    label: 'Poll',
    icon: BarChart3,
    description: 'Create a poll with multiple options for users to vote',
  },
  {
    type: 'rating',
    label: 'Rating',
    icon: Star,
    description: 'Collect star or custom icon ratings from users',
  },
  {
    type: 'phone',
    label: 'Phone Number',
    icon: Phone,
    description: 'Phone number input with validation',
  },
  {
    type: 'address',
    label: 'Address',
    icon: MapPin,
    description: 'Address input with multiple lines',
  },
  {
    type: 'link',
    label: 'Link',
    icon: Link2,
    description: 'URL input with validation',
  },
];

export const PALETTE_CONFIG = {
  COMPACT_GRID_COLS: 2,
  COMPACT_MAX_HEIGHT: 'max-h-64',

  HEADER: {
    TITLE: 'Form Fields',
    DESCRIPTION: 'Click to add fields to your form',
  },
} as const;
