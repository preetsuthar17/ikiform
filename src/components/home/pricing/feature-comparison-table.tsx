import React from 'react';
import { Kbd } from '@/components/ui/kbd';

const featureCategories = [
  {
    name: 'Features',
    features: [
      {
        label: 'Unlimited submissions',
        description:
          'Collect as many responses as you want without any limits.',
        included: true,
      },
      {
        label: 'Remove Ikiform branding',
        description: 'Customize your forms without Ikiform branding.',
        included: true,
      },
      {
        label: 'AI Form builder',
        description: 'Generate forms instantly using AI based on your needs.',
        included: true,
      },
      {
        label: 'Exporting responses',
        description: 'Export your form responses as CSV or JSON files.',
        included: true,
      },
      {
        label: 'Priority support',
        description:
          'Get faster responses and priority assistance from our team.',
        included: true,
      },
      {
        label: 'Mobile builder',
        description: 'Build and manage forms easily from your mobile device.',
        included: true,
      },
      {
        label: 'Logic builder',
        description: 'Create logic and conditional flows for your forms.',
        included: true,
      },
      {
        label: 'Webhooks',
        description: 'Enhanced webhook support for advanced workflows.',
        included: true,
      },
      {
        label: 'Fetching form field data from API',
        description: 'Populate form fields dynamically from external APIs.',
        included: true,
      },
      {
        label: 'Email notifications',
        description: 'Receive email notifications for form submissions.',
        included: true,
      },
      {
        label: 'Advance customization',
        description: 'Customize your forms with advanced styling options.',
        included: true,
      },
      {
        label: 'Basic logic builder',
        description: 'Set up simple conditional logic for your forms.',
        included: true,
      },
      {
        label: 'Password protection',
        description: 'Protect your forms with password access.',
        included: true,
      },
      {
        label: 'Redirect to URL',
        description: 'Redirect users to a custom URL after submission.',
        included: true,
      },
      {
        label: 'Conditional field rendering',
        description: 'Show or hide fields based on user input.',
        included: true,
      },
      {
        label: 'Calendly integration',
        description: 'Integrate Calendly scheduling into your forms.',
        included: true,
      },
      {
        label: 'Cal.com integration',
        description: 'Integrate Cal.com scheduling into your forms.',
        included: true,
      },
      {
        label: 'Collect signature',
        description: 'Allow users to sign forms digitally.',
        included: true,
      },
      {
        label: 'Discord webhook integration',
        description: 'Send form responses directly to Discord channels.',
        included: true,
      }, {
        label: 'Address field',
        description: 'Collect address information with a dedicated field.',
        included: true,
      },
      {
        label: 'Phone number field',
        description: 'Add phone number fields with validation.',
        included: true,
      },
      {
        label: 'Link fields',
        description: 'Allow users to submit links in your forms.',
        included: true,
      },
    ],
  },
  {
    name: 'Analytics',
    features: [
      {
        label: 'Advanced analytics',
        description:
          'Gain insights with detailed analytics and visualizations.',
        included: true,
      },
      {
        label: 'Form visit analytics',
        description: 'Track visits and interactions with your forms.',
        included: true,
      },
      {
        label: 'AI Analytics',
        description: 'Get AI-powered suggestions and analytics for your forms.',
        included: true,
      },
      {
        label: 'Trend analytics',
        description: 'Analyze trends and patterns in your form responses.',
        included: true,
      },
      {
        label: 'Drop-off analytics',
        description: 'Understand where users drop off in your forms.',
        included: true,
      },
    ],
  },

  {
    name: 'Upcoming features',
    features: [
      {
        label: 'Team collaboration',
        description: 'Work together with your team on forms and analytics.',
        included: false,
      },
      {
        label: 'Custom domains',
        description: 'Use your own domain for form links and branding.',
        included: false,
      },
      {
        label: 'Flagging responses',
        description:
          'Easily flag and review suspicious or important responses.',
        included: false,
      },
      {
        label: 'Integrations',
        description: 'More integrations with popular tools coming soon.',
        included: false,
      },
      {
        label: 'File uploads (in few days)',
        description: 'Allow users to upload files with their form submissions.',
        included: false,
      },
      {
        label: 'Form embedding',
        description: 'Embed forms easily into your website or app.',
        included: false,
      },
      {
        label: 'Form internationalization',
        description: 'Support multiple languages for your forms.',
        included: false,
      },
      {
        label: 'File upload field',
        description: 'Add file upload fields to your forms.',
        included: false,
      },
     
      {
        label: 'Slack integration',
        description: 'Send form responses directly to Slack channels.',
        included: false,
      },
      {
        label: 'Zapier integration',
        description: 'Automate workflows with Zapier integration.',
        included: false,
      },
      {
        label: 'Google Sheets integration',
        description: 'Sync form responses to Google Sheets automatically.',
        included: false,
      },
      {
        label: 'Customizing form metadata',
        description: 'Edit and customize metadata for your forms.',
        included: false,
      },
      {
        label: 'Workspaces (folders)',
        description: 'Organize your forms into folders or workspaces.',
        included: false,
      },
      {
        label: 'Inviting team members',
        description: 'Invite others to collaborate on your forms.',
        included: false,
      },
      {
        label: 'Pre-populating fields',
        description: 'Save time by pre-filling form fields with known data.',
        included: false,
      },
      {
        label: 'Scoring (quiz system)',
        description: 'Add scoring and quiz functionality to your forms.',
        included: false,
      },
      {
        label: 'Form templates',
        description: 'Start quickly with ready-made form templates.',
        included: false,
      },

      {
        label: 'and more',
        description: 'We are constantly adding new features and improvements.',
        included: false,
      },
    ],
  },
];

export default function FeatureComparisonTable() {
  return (
    <div className="mx-auto w-full overflow-x-auto px-4 pb-8 md:px-8">
      <div className="w-full rounded-card border bg-background shadow-md/2">
        <table className="w-full border-collapse overflow-hidden rounded-card text-left">
          <tbody>
            {featureCategories.map((category) => (
              <React.Fragment key={category.name}>
                <tr>
                  <td
                    className="bg-muted p-4 font-medium text-base"
                    colSpan={2}
                  >
                    {category.name}
                  </td>
                </tr>
                {category.features.map((feature) => (
                  <tr className="border-b last:border-0" key={feature.label}>
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="font-medium text-foreground text-sm">
                            {feature.label}
                          </div>
                          <div className="mt-1 text-muted-foreground text-sm">
                            {feature.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`p-4 text-center align-top max-sm:hidden ${feature.included ? '' : 'text-muted-foreground'}`}
                    >
                      {feature.included ? (
                        <Kbd size={'sm'}>Included</Kbd>
                      ) : (
                        <Kbd size={'sm'}>Soon</Kbd>
                      )}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
