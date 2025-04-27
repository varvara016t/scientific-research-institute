import { RenderMode, ServerRoute } from '@angular/ssr';
import { routes } from './app.routes';

/**
 * Серверные маршруты
 * Преобразуем основные маршруты приложения в серверные
 */
export const serverRoutes: ServerRoute[] = routes.map(route => ({
  path: route.path || '**',
  renderMode: RenderMode.Prerender
}));