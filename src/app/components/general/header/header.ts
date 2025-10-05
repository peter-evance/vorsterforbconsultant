import { Component, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {trigger, style, query, transition, stagger, animate } from '@angular/animations'
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { UntypedFormControl } from '@angular/forms';
// import { LanguageService } from 'src/app/services/language/language.service';
import { ThisReceiver } from '@angular/compiler';
import {Analytics} from "../../../services/analytics/analytics";
import { Language } from "../../../services/language/language.service";
import {
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    NgbNav,
    NgbNavContent,
    NgbNavItem,
    NgbNavLink
} from "@ng-bootstrap/ng-bootstrap";
import {DynamicButton} from "../dynamic-button/dynamic-button";
import {CommonModule, NgIf, NgStyle} from "@angular/common";


@Component({
  selector: 'app-header',
    imports: [
        NgbNav,
        NgbNavContent,
        NgbNavLink,
        NgbNavItem,
        RouterLink,
        DynamicButton,
        TranslatePipe,
        NgbDropdownMenu,
        NgbDropdownToggle,
        NgbDropdown,
        CommonModule
    ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
    animations: [
        trigger("animateMenu", [
            transition(":enter", [
                query("*", [
                    style({ opacity: 0, transform: "translateY(-50%)" }),
                    stagger(50, [
                        animate("250ms cubic-bezier(0.35, 0, 0.25, 1)", style({ opacity: 1, transform: "none" }))
                    ])
                ])
            ])
        ])
    ],
})
export class Header implements OnInit {
    responsiveMenuVisible: Boolean = false;
    pageYPosition!: number;
    languageFormControl: UntypedFormControl= new UntypedFormControl();
    cvName: string = "";

    constructor(
        private router: Router,
        public analyticsService: Analytics,
        public languageService: Language
    ) { }

    ngOnInit(): void {

        this.languageFormControl.valueChanges.subscribe(val => this.languageService.changeLanguage(val))

        this.languageFormControl.setValue(this.languageService.language)

    }

    scroll(el: string) {
        const element = document.getElementById(el);
        if(element) {
            element.scrollIntoView({behavior: 'smooth'});
        } else {
            this.router.navigate(['/home']).then(() => {
                const elAfterNav = document.getElementById(el);
                if (elAfterNav) {
                    elAfterNav.scrollIntoView({behavior: 'smooth'});
                }
            });
        }
        this.responsiveMenuVisible=false;
    }

    downloadCV(){
        this.languageService.translateService.get("Header.cvName").subscribe((val: string) => {
            this.cvName = val
            console.log(val)
            // app url
            let url = window.location.href;

            // Open a new window with the CV
            window.open(url + "/../assets/cv/" + this.cvName, "_blank");
        })

    }

    @HostListener('window:scroll', ['getScrollPosition($event)'])
    getScrollPosition(event: any) {
        this.pageYPosition=window.pageYOffset
    }

    changeLanguage(language: string) {
        this.languageFormControl.setValue(language);
    }

}
