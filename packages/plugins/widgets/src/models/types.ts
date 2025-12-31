import { Widget as PrismaWidget, WidgetSetting as PrismaWidgetSetting, Sidebar as PrismaSidebar } from '@prisma/client';

export type Widget = PrismaWidget & {
  settings?: WidgetSetting[];
};

export type WidgetSetting = PrismaWidgetSetting;

export type Sidebar = PrismaSidebar;

// Widget types
export enum WidgetType {
  TEXT = 'text',
  MENU = 'menu',
  RECENT_POSTS = 'recent_posts',
  CATEGORIES = 'categories',
  TAGS = 'tags',
  CUSTOM_HTML = 'custom_html',
  IMAGE = 'image',
  VIDEO = 'video',
  SOCIAL_LINKS = 'social_links',
  SEARCH = 'search',
  NEWSLETTER = 'newsletter'
}

// Widget configuration interfaces
export interface BaseWidgetConfig {
  title?: string;
  show_title?: boolean;
  css_class?: string;
}

export interface TextWidgetConfig extends BaseWidgetConfig {
  content: string;
}

export interface MenuWidgetConfig extends BaseWidgetConfig {
  menu_id: number;
}

export interface RecentPostsWidgetConfig extends BaseWidgetConfig {
  limit: number;
  show_excerpt?: boolean;
  show_date?: boolean;
  show_author?: boolean;
  category_ids?: number[];
}

export interface CategoriesWidgetConfig extends BaseWidgetConfig {
  show_post_count?: boolean;
  hierarchical?: boolean;
  limit?: number;
}

export interface TagsWidgetConfig extends BaseWidgetConfig {
  limit: number;
  show_post_count?: boolean;
}

export interface CustomHtmlWidgetConfig extends BaseWidgetConfig {
  html: string;
}

export interface ImageWidgetConfig extends BaseWidgetConfig {
  image_url: string;
  alt_text?: string;
  link_url?: string;
  open_in_new_tab?: boolean;
}

export interface VideoWidgetConfig extends BaseWidgetConfig {
  video_url: string;
  autoplay?: boolean;
  controls?: boolean;
  width?: number;
  height?: number;
}

export interface SocialLinksWidgetConfig extends BaseWidgetConfig {
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  youtube_url?: string;
  github_url?: string;
}

export interface SearchWidgetConfig extends BaseWidgetConfig {
  placeholder?: string;
}

export interface NewsletterWidgetConfig extends BaseWidgetConfig {
  description?: string;
  button_text?: string;
}

// Union type for all widget configs
export type WidgetConfig =
  | TextWidgetConfig
  | MenuWidgetConfig
  | RecentPostsWidgetConfig
  | CategoriesWidgetConfig
  | TagsWidgetConfig
  | CustomHtmlWidgetConfig
  | ImageWidgetConfig
  | VideoWidgetConfig
  | SocialLinksWidgetConfig
  | SearchWidgetConfig
  | NewsletterWidgetConfig;

// API request/response types
export interface CreateWidgetRequest {
  name: string;
  widget_type: WidgetType;
  sidebar_id?: number;
  position?: number;
  status?: string;
  config?: WidgetConfig;
}

export interface UpdateWidgetRequest {
  name?: string;
  sidebar_id?: number;
  position?: number;
  status?: string;
  config?: WidgetConfig;
}

export interface CreateSidebarRequest {
  name: string;
  location: string;
  description?: string;
  theme?: string;
  status?: string;
}

export interface UpdateSidebarRequest {
  name?: string;
  location?: string;
  description?: string;
  theme?: string;
  status?: string;
}

// Widget with config
export interface WidgetWithConfig extends Widget {
  config: WidgetConfig;
}

// Widget registry
export interface WidgetDefinition {
  type: WidgetType;
  name: string;
  description: string;
  configSchema: Record<string, any>; // Zod schema would be ideal here
  render: (config: WidgetConfig, widget: Widget) => string; // Server-side rendering
}
