import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Analytics } from '../../../services/analytics/analytics';
import { Animations } from '../../../services/animations/animations';
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
// Import CarouselModule and OwlOptions
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

// Define a type for the Leadership Team member for better type safety
interface Leader {
    Name: string;
    Title: string;
    Bio: string;
    Img?: string; // Made optional to handle cases where it might be missing or empty
}

@Component({
    selector: 'app-about',
    templateUrl: './about.html',
    styleUrl: './about.scss',
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({opacity: 0}),
                animate('300ms ease-in', style({opacity: 1}))
            ]),
            transition(':leave', [
                animate('300ms ease-out', style({opacity: 0}))
            ])
        ]),
        trigger('zoomIn', [
            transition(':enter', [
                style({transform: 'scale(0.3)', opacity: 0}),
                animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({transform: 'scale(1)', opacity: 1}))
            ])
        ])
    ],
    imports: [
        TranslatePipe,
        CommonModule,
        CarouselModule,
        NgOptimizedImage,
        // Add CarouselModule to imports
    ]
})
export class About implements OnInit, AfterViewInit {

    // Modal for enlarged office image (keeping the original logic for reference)
    isImageModalOpen = false;

    // NEW: Modal state for Leader Details
    isLeaderModalOpen = false;
    selectedLeader: Leader | null = null;
    leadershipTeam: Leader[] = [];

    // NEW: Owl Carousel Options
    leaderCarouselOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: false,
        navSpeed: 700,
        items: 1,
        autoplay: true,
        autoplayTimeout: 4000,
        dots: true // Show dots for navigation
    }

    constructor(
        public analyticsService: Analytics,
        private animationsService: Animations,
        private elementRef: ElementRef,
        private translateService: TranslateService // Inject TranslateService to get leadership data
    ) { }

    ngOnInit(): void {
        // NEW: Load leadership team data on init
        this.translateService.get('Leadership.Team').subscribe((data: Leader[]) => {
            if (Array.isArray(data)) {
                this.leadershipTeam = data;
            }
        });
    }

    ngAfterViewInit(): void {
        this.initAnimations();
    }

    // OLD: Logic for the office image modal (keeping it to respect original code)
    onImageClick(): void {
        this.analyticsService.sendAnalyticsEvent("click_image", "about", "office_image");
        this.openImageModal();
    }

    openImageModal(): void {
        this.isImageModalOpen = true;
        document.body.style.overflow = 'hidden';
    }
    // End of OLD logic

    // NEW: Logic for Leader Details Modal
    onLeaderClick(leader: Leader): void {
        this.analyticsService.sendAnalyticsEvent("click_leader", "about", leader.Name);
        this.selectedLeader = leader;
        this.isLeaderModalOpen = true;
        document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    }

    closeLeaderModal(): void {
        this.isLeaderModalOpen = false;
        this.selectedLeader = null;
        this.closeAnyModal();
    }

    // Combined function to restore body scroll
    private closeAnyModal(): void {
        if (!this.isImageModalOpen && !this.isLeaderModalOpen) {
            document.body.style.overflow = 'auto'; // Restaurar scroll del body
        }
    }

    // Combined modal close functions
    closeImageModal(): void {
        this.isImageModalOpen = false;
        this.closeAnyModal();
    }

    onModalBackdropClick(event: Event): void {
        if (event.target === event.currentTarget) {
            if (this.isImageModalOpen) {
                this.closeImageModal();
            }
            if (this.isLeaderModalOpen) {
                this.closeLeaderModal();
            }
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            if (this.isImageModalOpen) {
                this.closeImageModal();
            }
            if (this.isLeaderModalOpen) {
                this.closeLeaderModal();
            }
        }
    }
    // End of NEW logic

    private initAnimations(): void {
        const aboutSection = this.elementRef.nativeElement;

        // Animar título
        const title = aboutSection.querySelector('.about-title');
        if (title) {
            this.animationsService.observeElement(title, {
                type: 'slideInUp',
                duration: 1000
            });
        }

        // Animar párrafos con stagger
        const paragraphs = aboutSection.querySelectorAll('.about-description p');
        paragraphs.forEach((p: HTMLElement, index: number) => {
            this.animationsService.observeElement(p, {
                type: 'fadeInLeft',
                duration: 800,
                delay: 200 + (index * 300)
            });
        });

        // Animar lista de skills
        const skillsList = aboutSection.querySelector('.skills-list');
        if (skillsList) {
            this.animationsService.observeElement(skillsList as HTMLElement, {
                type: 'fadeInUp',
                delay: 800
            });
        }

        // Animar skills individuales con stagger
        const skills = aboutSection.querySelectorAll('.skill-element');
        skills.forEach((skill: HTMLElement, index: number) => {
            this.animationsService.observeElement(skill, {
                type: 'scaleIn',
                delay: 1000 + (index * 100)
            });

            // Añadir efectos hover
            this.animationsService.addHoverEffects(skill, ['lift', 'glow']);
        });

        // Animar imagen (now the carousel container)
        const imageContainer = aboutSection.querySelector('.about-img-container');
        if (imageContainer) {
            this.animationsService.observeElement(imageContainer as HTMLElement, {
                type: 'morphIn',
                duration: 1200,
                delay: 600
            });
        }
    }
}