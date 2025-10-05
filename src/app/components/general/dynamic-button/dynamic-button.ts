import { Component, inject, input, output } from '@angular/core';
import { Analytics } from '../../../services/analytics/analytics';
import {CommonModule, NgForOf} from "@angular/common";

@Component({
  selector: 'app-dynamic-button',
    imports: [
        CommonModule

    ],
  templateUrl: './dynamic-button.html',
  styleUrl: './dynamic-button.scss'
})
export class DynamicButton {
  text = input('')
  href = input('')
  target = input('_blank')
  analyticsEvent = input('')
  analyticsCategory = input('')
  analyticsLabel = input('')
  disabled = input(false)
  variant = input<'primary' | 'secondary'>('primary')
  size = input<'default' | 'small'>('default')

  buttonClick = output()

  analyticsService = inject(Analytics);

  onButtonClick(event: Event) {
    if(this.disabled()) {
      event.preventDefault();
      return;
    }

    if (this.analyticsEvent() && this.analyticsCategory() && this.analyticsLabel()) {
      this.analyticsService.sendAnalyticsEvent(
        this.analyticsEvent(),
        this.analyticsCategory(),
        this.analyticsLabel()
      );
    }
    
    this.buttonClick.emit();
  }
}
