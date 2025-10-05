import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Analytics } from '../../../services/analytics/analytics';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-more-services',
    imports: [
        TranslatePipe,
        CommonModule
    ],
  templateUrl: './more-services.html',
  styleUrl: './more-services.scss'
})
export class MoreServices implements OnInit {

  constructor(
    private router: Router,
    public analyticsService: Analytics
    ) { }

    ngOnInit() {
        this.router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            window.scrollTo(0, 0)
        });
    }
    redirect(route: string, event: { target: { id: any; }; }) {
      const id = event.target.id;
      if(id=='demoLink' || id=='ghLink'){
        return
      }
      window.open(route, '_blank');
    }

}
