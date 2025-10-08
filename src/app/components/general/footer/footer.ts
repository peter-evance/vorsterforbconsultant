import {Component, inject} from '@angular/core';
import { trigger, query, stagger, animate, style, transition } from '@angular/animations'
import {Analytics} from "../../../services/analytics/analytics";
import {Services} from "../../home/services/services";
import {Jobs} from "../../home/jobs/jobs";

@Component({
  selector: 'app-footer',
    imports: [
        Jobs
    ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
    animations: [
        trigger("animateFooter", [
            transition(":enter", [
                query("*", [
                    style({ opacity: 0, transform: "translateY(100%)" }),
                    stagger(50, [
                        animate("250ms cubic-bezier(0.35, 0, 0.25, 1)", style({ opacity: 1, transform: "none" }))
                    ])
                ])
            ])
        ])
    ],
})
export class Footer {
    analyticsService = inject(Analytics);
}
