import type { GlobalConfig } from 'payload'

export const AgencySettings: GlobalConfig = {
  slug: 'agency-settings',
  label: 'Agency Settings',
  admin: {
    group: 'Organization Settings',
  },
  access: {
    read: () => true, // Publicly readable so frontend can fetch it for SEO & JSON-LD
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // TAB 1: IDENTITY & BRANDING
        {
          label: 'Agency Identity',
          description:
            'Basic branding, identity details, and media assets used across the website and SEO schema.',
          fields: [
            {
              type: 'group',
              name: 'identity',
              interfaceName: 'AgencyIdentity',
              label: 'Branding Details',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Legal Agency Name',
                  defaultValue: 'Mjini Digital',
                },
                {
                  name: 'legalName',
                  type: 'text',
                  label: 'Official Corporate Registered Name',
                  defaultValue: 'Mjini Digital Agency Ltd',
                },
                {
                  name: 'alternateName',
                  type: 'array',
                  label: 'Alternate / Trade Names (Doing Business As)',
                  labels: { singular: 'Alternate Name', plural: 'Alternate Names' },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'slogan',
                  type: 'text',
                  label: 'Tagline / Slogan',
                  defaultValue: 'Empowering African Brands Online',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Full Organization Description',
                  defaultValue:
                    'Mjini Digital is a premier digital growth agency based in Nairobi, Kenya, building conversion-focused websites, advanced technical SEO systems, secure e-commerce platforms, and high-performance custom software for local and international brands.',
                },
                {
                  name: 'shortDescription',
                  type: 'textarea',
                  label: 'Short Organization Description (for Meta & Snippets)',
                  defaultValue:
                    'Nairobi-based digital agency offering custom web design, technical SEO, e-commerce, and software development for African and global brands.',
                },
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Primary Logo',
                  admin: {
                    description:
                      'High-resolution logo with transparent background for schema mapping.',
                  },
                },
                {
                  name: 'images',
                  type: 'array',
                  label: 'Organization / Office Photos (Schema Image Gallery)',
                  labels: { singular: 'Photo', plural: 'Photos' },
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'foundingDate',
                  type: 'text',
                  label: 'Founding Year / Date (e.g., 2020 or 2020-01-01)',
                  defaultValue: '2020',
                },
                {
                  name: 'foundingLocation',
                  type: 'text',
                  label: 'Founding City & Country',
                  defaultValue: 'Nairobi, Kenya',
                },
                {
                  name: 'vatId',
                  type: 'text',
                  label: 'VAT / KRA PIN / Tax ID',
                  defaultValue: 'KE-VAT-XXXXXXXXX',
                },
                {
                  name: 'duns',
                  type: 'text',
                  label: 'D-U-N-S® Number (if applicable)',
                },
              ],
            },
          ],
        },

        // TAB 2: CONTACT & LOCATION
        {
          label: 'Contact & Location',
          description:
            'Physical address, geolocation, and communications contact points for structured data.',
          fields: [
            {
              type: 'group',
              name: 'contact',
              interfaceName: 'AgencyContact',
              label: 'Communications',
              fields: [
                {
                  name: 'primaryPhone',
                  type: 'text',
                  required: true,
                  label: 'Primary Phone Number',
                  defaultValue: '+254700000000',
                },
                {
                  name: 'primaryEmail',
                  type: 'email',
                  required: true,
                  label: 'Primary Contact Email',
                  defaultValue: 'hello@mjinidigital.co.ke',
                },
                {
                  name: 'emails',
                  type: 'array',
                  label: 'Department Email Addresses',
                  minRows: 1,
                  labels: { singular: 'Department Email', plural: 'Department Emails' },
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'General / Info', value: 'info' },
                        { label: 'Sales / New Business', value: 'sales' },
                        { label: 'Customer Support', value: 'support' },
                        { label: 'Technical Support', value: 'technical' },
                        { label: 'Billing / Finance', value: 'billing' },
                      ],
                      defaultValue: 'info',
                    },
                    {
                      name: 'email',
                      type: 'email',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'contactPoints',
                  type: 'array',
                  label: 'Schema Contact Points (Sales, Support, Tech)',
                  labels: { singular: 'Contact Point', plural: 'Contact Points' },
                  fields: [
                    {
                      name: 'contactType',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Sales', value: 'sales' },
                        { label: 'Customer Support', value: 'customer support' },
                        { label: 'Technical Support', value: 'technical support' },
                        { label: 'Billing', value: 'billing' },
                        { label: 'General Info', value: 'general' },
                      ],
                    },
                    {
                      name: 'telephone',
                      type: 'text',
                      label: 'Phone Number (leave empty to use Primary Phone)',
                    },
                    {
                      name: 'email',
                      type: 'email',
                      label: 'Email (leave empty to use Primary Email)',
                    },
                    {
                      name: 'availableLanguage',
                      type: 'text',
                      label: 'Available Languages (e.g., English, Swahili)',
                      defaultValue: 'English, Swahili',
                    },
                    {
                      name: 'areaServed',
                      type: 'text',
                      label: 'Area Served (e.g. KE, UG, TZ or Worldwide)',
                      defaultValue: 'Worldwide',
                    },
                  ],
                },
              ],
            },
            {
              type: 'group',
              name: 'address',
              interfaceName: 'AgencyAddress',
              label: 'Physical Address (Schema LocalBusiness & PostalAddress Compatible)',
              fields: [
                {
                  name: 'streetAddress',
                  type: 'text',
                  required: true,
                  label: 'Street Address (e.g., Mombasa Road, Mirage Towers, Suite 4B)',
                  defaultValue: 'Mombasa Road, Mirage Towers, Suite 4B',
                },
                {
                  name: 'addressLocality',
                  type: 'text',
                  required: true,
                  label: 'City / Locality',
                  defaultValue: 'Nairobi',
                },
                {
                  name: 'addressRegion',
                  type: 'text',
                  required: true,
                  label: 'State / Province / Region / County',
                  defaultValue: 'Nairobi County',
                },
                {
                  name: 'postalCode',
                  type: 'text',
                  required: true,
                  label: 'Postal / ZIP Code',
                  defaultValue: '00100',
                },
                {
                  name: 'addressCountry',
                  type: 'text',
                  required: true,
                  label: 'Country Code (e.g., KE, US, GB)',
                  defaultValue: 'KE',
                },
              ],
            },
            {
              type: 'group',
              name: 'geo',
              interfaceName: 'AgencyGeo',
              label: 'Geolocation & Map Embeds',
              fields: [
                {
                  name: 'latitude',
                  type: 'text',
                  required: true,
                  label: 'Latitude (e.g. -1.2921)',
                  defaultValue: '-1.2921',
                },
                {
                  name: 'longitude',
                  type: 'text',
                  required: true,
                  label: 'Longitude (e.g. 36.8219)',
                  defaultValue: '36.8219',
                },
                {
                  name: 'googleMapsUrl',
                  type: 'text',
                  label: 'Google Maps Link / URL',
                  defaultValue: 'https://maps.google.com/?q=-1.2921,36.8219',
                },
              ],
            },
          ],
        },

        // TAB 3: SOCIAL & ONLINE PROFILES
        {
          label: 'Social Profiles',
          description: 'Social media profile handles mapped to the schema "sameAs" array.',
          fields: [
            {
              name: 'googleBusinessProfile',
              type: 'text',
              label: 'Google Business Profile URL (e.g., https://g.co/kgs/mjinidigital)',
              defaultValue: 'https://g.co/kgs/mjinidigital',
            },
            {
              name: 'socials',
              type: 'array',
              label: 'Social Media Accounts',
              labels: { singular: 'Profile', plural: 'Profiles' },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'X / Twitter', value: 'twitter' },
                    { label: 'GitHub', value: 'github' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'Other', value: 'other' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'Full Profile URL',
                },
              ],
            },
          ],
        },

        // TAB 4: COMMERCE & OPERATIONS
        {
          label: 'Commerce & Operations',
          description:
            'Pricing ranges, currencies, payment methods, opening hours, and target market areas.',
          fields: [
            {
              type: 'group',
              name: 'commerce',
              interfaceName: 'AgencyCommerce',
              label: 'Commercial Parameters',
              fields: [
                {
                  name: 'priceRange',
                  type: 'select',
                  label: 'Price Indicator',
                  options: [
                    { label: '$ (Budget)', value: '$' },
                    { label: '$$ (Moderate / Professional)', value: '$$' },
                    { label: '$$$ (High End)', value: '$$$' },
                    { label: '$$$$ (Enterprise)', value: '$$$$' },
                  ],
                  defaultValue: '$$',
                },
                {
                  name: 'currenciesAccepted',
                  type: 'text',
                  label: 'Currencies Accepted (comma-separated)',
                  defaultValue: 'KES, USD, GBP, AED',
                },
                {
                  name: 'paymentAccepted',
                  type: 'text',
                  label: 'Payment Methods Accepted (comma-separated)',
                  defaultValue: 'Cash, Bank Transfer, M-Pesa, Credit Card, PayPal',
                },
                {
                  name: 'openingHours',
                  type: 'array',
                  label: 'Operating Hours',
                  labels: { singular: 'Schedule', plural: 'Schedules' },
                  fields: [
                    {
                      name: 'dayOfWeek',
                      type: 'select',
                      hasMany: true,
                      required: true,
                      options: [
                        { label: 'Monday', value: 'Monday' },
                        { label: 'Tuesday', value: 'Tuesday' },
                        { label: 'Wednesday', value: 'Wednesday' },
                        { label: 'Thursday', value: 'Thursday' },
                        { label: 'Friday', value: 'Friday' },
                        { label: 'Saturday', value: 'Saturday' },
                        { label: 'Sunday', value: 'Sunday' },
                      ],
                    },
                    {
                      name: 'opens',
                      type: 'text',
                      required: true,
                      label: 'Opening Time (24h e.g., 08:00)',
                      defaultValue: '08:00',
                    },
                    {
                      name: 'closes',
                      type: 'text',
                      required: true,
                      label: 'Closing Time (24h e.g., 17:00)',
                      defaultValue: '17:00',
                    },
                  ],
                },
                {
                  name: 'serviceTypes',
                  type: 'array',
                  label: 'Core Service Offerings (for schema.org serviceTypes)',
                  labels: { singular: 'Service Type', plural: 'Service Types' },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'areaServed',
                  type: 'array',
                  label: 'Geographical Service Areas',
                  labels: { singular: 'Area', plural: 'Areas' },
                  fields: [
                    {
                      name: 'type',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'City', value: 'City' },
                        { label: 'Country', value: 'Country' },
                        { label: 'Administrative Area / Region', value: 'AdministrativeArea' },
                      ],
                      defaultValue: 'Country',
                    },
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      label: 'Location Name (e.g. Nairobi, Kenya, United Kingdom)',
                    },
                    {
                      name: 'sameAs',
                      type: 'text',
                      label: 'Wikipedia / Wikidata URL (Optional)',
                    },
                  ],
                },
                {
                  name: 'defaultKeywords',
                  type: 'array',
                  label: 'Primary SEO Keywords',
                  labels: { singular: 'Keyword', plural: 'Keywords' },
                  fields: [
                    {
                      name: 'keyword',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },

        // TAB 5: LEADERSHIP & RECOGNITION
        {
          label: 'Leadership & Awards',
          description: 'Founders, staff size, and industry accreditations.',
          fields: [
            {
              type: 'group',
              name: 'leadership',
              interfaceName: 'AgencyLeadership',
              label: 'People & Accreditations',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'employeeMin',
                      type: 'number',
                      label: 'Minimum Employees',
                      defaultValue: 5,
                    },
                    {
                      name: 'employeeMax',
                      type: 'number',
                      label: 'Maximum Employees',
                      defaultValue: 20,
                    },
                  ],
                },
                {
                  name: 'teamFounders',
                  type: 'relationship',
                  relationTo: 'team',
                  hasMany: true,
                  label: 'Founders from Team Members',
                },
                {
                  name: 'founders',
                  type: 'array',
                  label: 'Custom Founders / Executive Leadership',
                  labels: { singular: 'Founder', plural: 'Founders' },
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      label: 'Full Name',
                    },
                    {
                      name: 'jobTitle',
                      type: 'text',
                      label: 'Title (e.g. Founder & CEO)',
                      defaultValue: 'Founder & CEO',
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'Profile / Bio Link',
                    },
                  ],
                },
                {
                  name: 'awards',
                  type: 'array',
                  label: 'Awards & Certifications',
                  labels: { singular: 'Award', plural: 'Awards' },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: 'Award / Accreditation Title (e.g. Google Partner Agency)',
                    },
                  ],
                },
              ],
            },
          ],
        },

        // TAB 6: BRAND CULTURE (VISION, MISSION, VALUES)
        {
          label: 'Culture & Strategy',
          description: 'Core organizational foundational statements.',
          fields: [
            {
              type: 'group',
              name: 'culture',
              interfaceName: 'AgencyCulture',
              label: 'Corporate Strategy',
              fields: [
                {
                  name: 'mission',
                  type: 'textarea',
                  required: true,
                  label: 'Mission Statement',
                  admin: {
                    description:
                      'What the agency does, who it serves, and how it delivers value today.',
                  },
                },
                {
                  name: 'vision',
                  type: 'textarea',
                  required: true,
                  label: 'Vision Statement',
                  admin: {
                    description: 'The long-term aspirational goal of the web agency.',
                  },
                },
                {
                  name: 'values',
                  type: 'array',
                  label: 'Core Values',
                  labels: { singular: 'Value Element', plural: 'Value Elements' },
                  admin: {
                    description:
                      'The ethical framework guiding agency design, development, and partnerships.',
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      label: 'Value Name (e.g., Transparency, Quality)',
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      required: true,
                      label: 'Value Definition',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

