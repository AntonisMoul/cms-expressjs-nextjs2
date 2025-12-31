import { Widget, MenuWidgetConfig } from '../models/types';

export class MenuWidget {
  static async render(config: MenuWidgetConfig, widget: Widget): Promise<string> {
    const title = config.show_title !== false && config.title ? `<h3 class="widget-title">${config.title}</h3>` : '';
    const cssClass = config.css_class ? ` ${config.css_class}` : '';

    // This would normally fetch the menu data and render it
    // For now, we'll return a placeholder
    const menuHtml = await this.renderMenu(config.menu_id);

    return `
      <div class="widget widget-menu${cssClass}">
        ${title}
        <div class="widget-content">
          ${menuHtml}
        </div>
      </div>
    `;
  }

  static getDefaultConfig(): MenuWidgetConfig {
    return {
      title: '',
      show_title: true,
      css_class: '',
      menu_id: 0
    };
  }

  private static async renderMenu(menuId: number): Promise<string> {
    // This would integrate with the menu plugin to render the menu
    // For now, return a placeholder
    return `
      <nav class="widget-menu-nav">
        <ul class="menu">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    `;
  }
}
