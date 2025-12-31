import { Widget, TextWidgetConfig } from '../models/types';

export class TextWidget {
  static render(config: TextWidgetConfig, widget: Widget): string {
    const title = config.show_title !== false && config.title ? `<h3 class="widget-title">${config.title}</h3>` : '';
    const cssClass = config.css_class ? ` ${config.css_class}` : '';

    return `
      <div class="widget widget-text${cssClass}">
        ${title}
        <div class="widget-content">
          ${config.content}
        </div>
      </div>
    `;
  }

  static getDefaultConfig(): TextWidgetConfig {
    return {
      title: '',
      show_title: true,
      css_class: '',
      content: ''
    };
  }
}
