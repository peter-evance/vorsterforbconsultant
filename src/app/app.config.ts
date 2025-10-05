import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';
import {provideClientHydration, withEventReplay, withIncrementalHydration} from '@angular/platform-browser';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {ServiceWorkerModule} from "@angular/service-worker";
import { TranslateHttpLoader, TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import { environment } from '../environments/environment';
import routes from "./app.routes";

export function createTranslateLoader(): TranslateHttpLoader {
    return new TranslateHttpLoader();
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: TRANSLATE_HTTP_LOADER_CONFIG, useValue: { prefix: './assets/i18n/', suffix: '.json' } },
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideTranslateService({
        loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
        },
    }),
    importProvidersFrom(
      ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: environment.production,
      })
    ),
  ]
};
