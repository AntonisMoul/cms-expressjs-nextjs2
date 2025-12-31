import { Widget, RecentPostsWidgetConfig } from '../models/types';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  created_at: string;
  author?: {
    name: string;
  };
}

export class RecentPostsWidget {
  static async render(config: RecentPostsWidgetConfig, widget: Widget): Promise<string> {
    const title = config.show_title !== false && config.title ? `<h3 class="widget-title">${config.title}</h3>` : '';
    const cssClass = config.css_class ? ` ${config.css_class}` : '';

    // This would normally fetch recent posts from the blog plugin
    const posts = await this.getRecentPosts(config.limit, config.category_ids);

    const postsHtml = posts.map(post => {
      const excerpt = config.show_excerpt && post.excerpt ? `<p class="post-excerpt">${post.excerpt}</p>` : '';
      const date = config.show_date ? `<span class="post-date">${new Date(post.created_at).toLocaleDateString()}</span>` : '';
      const author = config.show_author && post.author ? `<span class="post-author">by ${post.author.name}</span>` : '';

      return `
        <article class="recent-post">
          <h4 class="post-title"><a href="/blog/${post.slug}">${post.title}</a></h4>
          ${excerpt}
          <div class="post-meta">
            ${date} ${author}
          </div>
        </article>
      `;
    }).join('');

    return `
      <div class="widget widget-recent-posts${cssClass}">
        ${title}
        <div class="widget-content">
          ${postsHtml}
        </div>
      </div>
    `;
  }

  static getDefaultConfig(): RecentPostsWidgetConfig {
    return {
      title: 'Recent Posts',
      show_title: true,
      css_class: '',
      limit: 5,
      show_excerpt: true,
      show_date: true,
      show_author: false
    };
  }

  private static async getRecentPosts(limit: number, categoryIds?: number[]): Promise<Post[]> {
    // This would integrate with the blog plugin to fetch recent posts
    // For now, return placeholder data
    return [
      {
        id: 1,
        title: 'Welcome to Our Blog',
        slug: 'welcome-to-our-blog',
        excerpt: 'This is the first post on our blog...',
        created_at: new Date().toISOString(),
        author: { name: 'Admin' }
      },
      {
        id: 2,
        title: 'Getting Started Guide',
        slug: 'getting-started-guide',
        excerpt: 'Learn how to get started with our platform...',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        author: { name: 'Admin' }
      }
    ].slice(0, limit);
  }
}
