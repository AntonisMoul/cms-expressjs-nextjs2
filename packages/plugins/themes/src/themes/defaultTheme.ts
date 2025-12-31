import { ThemeDefinition } from '../models/types';

export const defaultTheme: ThemeDefinition = {
  name: 'Default Theme',
  description: 'A clean and modern default theme for the CMS',
  version: '1.0.0',
  author: 'CMS Team',
  author_url: 'https://cms.example.com',
  tags: ['default', 'clean', 'modern', 'responsive'],
  image: '/themes/default/screenshot.png',
  options: {
    general: {
      site_title: {
        type: 'text',
        label: 'Site Title',
        description: 'The main title of your website',
        default_value: 'My Website',
        required: true
      },
      site_description: {
        type: 'textarea',
        label: 'Site Description',
        description: 'A brief description of your website',
        rows: 3,
        placeholder: 'Enter site description...'
      },
      logo_url: {
        type: 'image',
        label: 'Logo',
        description: 'Upload your website logo'
      },
      favicon_url: {
        type: 'image',
        label: 'Favicon',
        description: 'Upload your website favicon (16x16 or 32x32 PNG)'
      }
    },
    colors: {
      primary_color: {
        type: 'color',
        label: 'Primary Color',
        description: 'Main brand color used throughout the site',
        default_value: '#007bff'
      },
      secondary_color: {
        type: 'color',
        label: 'Secondary Color',
        description: 'Secondary brand color',
        default_value: '#6c757d'
      },
      text_color: {
        type: 'color',
        label: 'Text Color',
        description: 'Primary text color',
        default_value: '#333333'
      },
      background_color: {
        type: 'color',
        label: 'Background Color',
        description: 'Main background color',
        default_value: '#ffffff'
      },
      link_color: {
        type: 'color',
        label: 'Link Color',
        description: 'Color for links',
        default_value: '#007bff'
      }
    },
    typography: {
      font_family: {
        type: 'select',
        label: 'Font Family',
        description: 'Primary font family for the website',
        default_value: 'inter',
        options: [
          { label: 'Inter', value: 'inter' },
          { label: 'Roboto', value: 'roboto' },
          { label: 'Open Sans', value: 'open-sans' },
          { label: 'Lato', value: 'lato' },
          { label: 'Montserrat', value: 'montserrat' },
          { label: 'Poppins', value: 'poppins' }
        ]
      },
      font_size_base: {
        type: 'select',
        label: 'Base Font Size',
        description: 'Base font size for the website',
        default_value: '16px',
        options: [
          { label: '14px', value: '14px' },
          { label: '16px', value: '16px' },
          { label: '18px', value: '18px' },
          { label: '20px', value: '20px' }
        ]
      },
      heading_font_family: {
        type: 'select',
        label: 'Heading Font Family',
        description: 'Font family for headings (H1-H6)',
        default_value: 'inter',
        options: [
          { label: 'Same as body', value: 'inherit' },
          { label: 'Inter', value: 'inter' },
          { label: 'Roboto', value: 'roboto' },
          { label: 'Montserrat', value: 'montserrat' },
          { label: 'Poppins', value: 'poppins' },
          { label: 'Playfair Display', value: 'playfair' }
        ]
      }
    },
    layout: {
      container_width: {
        type: 'select',
        label: 'Container Width',
        description: 'Maximum width of the main content container',
        default_value: '1200px',
        options: [
          { label: '960px (Narrow)', value: '960px' },
          { label: '1200px (Standard)', value: '1200px' },
          { label: '1400px (Wide)', value: '1400px' },
          { label: 'Full Width', value: '100%' }
        ]
      },
      sidebar_position: {
        type: 'select',
        label: 'Sidebar Position',
        description: 'Position of the sidebar relative to content',
        default_value: 'right',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
          { label: 'No sidebar', value: 'none' }
        ]
      },
      sidebar_width: {
        type: 'number',
        label: 'Sidebar Width',
        description: 'Width of the sidebar in pixels',
        default_value: 300,
        min: 200,
        max: 400,
        step: 10
      }
    },
    header: {
      header_style: {
        type: 'select',
        label: 'Header Style',
        description: 'Layout style for the website header',
        default_value: 'horizontal',
        options: [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
          { label: 'Centered', value: 'centered' }
        ]
      },
      header_height: {
        type: 'number',
        label: 'Header Height',
        description: 'Height of the header in pixels',
        default_value: 80,
        min: 50,
        max: 200,
        step: 5
      },
      sticky_header: {
        type: 'boolean',
        label: 'Sticky Header',
        description: 'Keep header visible when scrolling',
        default_value: false
      }
    },
    footer: {
      footer_text: {
        type: 'textarea',
        label: 'Footer Text',
        description: 'Text to display in the footer',
        rows: 2,
        default_value: '© 2024 My Website. All rights reserved.',
        placeholder: 'Enter footer text...'
      },
      show_social_links: {
        type: 'boolean',
        label: 'Show Social Links',
        description: 'Display social media links in footer',
        default_value: true
      }
    }
  }
};
