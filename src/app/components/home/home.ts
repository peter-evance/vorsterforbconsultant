import {Component, inject, OnInit} from '@angular/core';
import {Analytics} from "../../services/analytics/analytics";
import {Banner} from "./banner/banner";
import {About} from "./about/about";
import {Jobs} from "./jobs/jobs";
import {Services} from "./services/services";
import {MoreServices} from "./more-services/more-services";
import {Contact} from "./contact/contact";
import {ContactOffice} from "./contact-office/contact-office";

@Component({
  selector: 'app-home',
    imports: [
        Banner,
        About,
        Jobs,
        Services,
        MoreServices,
        Contact,
    ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit  {
    analyticsService = inject(Analytics)

    ngOnInit(): void {
        this.analyticsService.sendAnalyticsPageView("/logo", "Lets go...")
    }

}
