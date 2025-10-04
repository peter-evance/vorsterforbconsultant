import {inject, Injectable} from '@angular/core';
import { GoogleAnalyticsService } from 'ngx-google-analytics';


@Injectable({
  providedIn: 'root'
})
export class Analytics {
  private googleAnalyticsService = inject(GoogleAnalyticsService);

  sendAnalyticsEvent(action: string, category: string, label: string) {
    this.googleAnalyticsService.event(action, category, label);
  }

  sendAnalyticsPageView(path: string, title: string) {
    this.googleAnalyticsService.pageView(path, title);
  }
}
