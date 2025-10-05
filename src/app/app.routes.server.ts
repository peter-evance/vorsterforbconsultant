import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server,
      // async getPrerenderParams(){
      //   const languages = ['en', 'sw']
      //     return languages.map(language => ({language}))
      // }
  }
];
