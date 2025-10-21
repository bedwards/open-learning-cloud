const routes = {
  lessons: () => import('../views/lessons.js'),
  create: () => import('../views/create.js'),
  analytics: () => import('../views/analytics.js'),
  lesson: () => import('../views/lesson-detail.js'),
};

class Router {
  constructor() {
    this.currentView = null;
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  async handleRoute() {
    const hash = window.location.hash.slice(1) || 'lessons';
    const [route, ...params] = hash.split('/');

    const content = document.getElementById('content');

    if (routes[route]) {
      try {
        const module = await routes[route]();
        this.currentView = module.default;
        await this.currentView.render(content, params);
      } catch (error) {
        console.error('Failed to load route:', error);
        content.innerHTML = '<p>Failed to load page</p>';
      }
    } else {
      content.innerHTML = '<p>Page not found</p>';
    }
  }
}

export const router = new Router();
