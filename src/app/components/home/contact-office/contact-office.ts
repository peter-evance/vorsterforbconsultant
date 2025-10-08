import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Analytics } from '../../../services/analytics/analytics';
import { Animations } from '../../../services/animations/animations';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from "@ngx-translate/core";
import { DynamicButton } from '../../general/dynamic-button/dynamic-button';

@Component({
    selector: 'app-contact-office',
    imports: [
        CommonModule,
        NgbNavModule,
        DynamicButton
    ],
    templateUrl: './contact-office.html',
    styleUrl: './contact-office.scss'
})
export class ContactOffice implements  AfterViewInit {

    active = 0

    // Contact data structure
    contactSections = [
        {
            tab: 'Schedule',
            title: 'Schedule a Consultation',
            icon: '📅',
            content: [
                'Book a personalized consultation with our expert team to discuss your specific needs',
                'Flexible scheduling available to accommodate your business hours',
                'Initial consultations can be conducted in-person or virtually'
            ]
        },
        {
            tab: 'Contact',
            title: 'Contact Information',
            icon: '📞',
            content: [
                '<strong>Email:</strong> <a href="mailto:forbmanagement@gmail.com">forbmanagement@gmail.com</a>',
                '<strong>Phone:</strong> <a href="tel:+254722853849">+254 722 853 849</a>',
                '<strong>Alternative:</strong> <a href="tel:+254729088918">+254 729 088 918</a> | <a href="tel:+254783173388">+254 783 173 388</a>'
            ]
        },
        {
            tab: 'Location',
            title: 'Visit Our Office',
            icon: '📍',
            content: [
                '<strong>Address:</strong> Galexon House, 5th Floor',
                'Golf Course Centre',
                'Off Mbagathi/Ngumo Road',
                'Nairobi, Kenya'
            ]
        },
        {
            tab: 'Hours',
            title: 'Office Hours',
            icon: '🕐',
            content: [
                '<strong>Monday - Friday</strong>',
                '8:00 AM - 5:00 PM EAT',
                'Closed on public holidays',
                'After-hours consultations available by appointment'
            ]
        }
    ];

    constructor(
        public analyticsService: Analytics,
        private animationsService: Animations,
        private elementRef: ElementRef
    ) { }


    ngAfterViewInit(): void {
        this.initAnimations();
    }

    /**
     * Initialize intersection observer-based animations
     * Complexity: O(n) where n is the number of animated elements
     *
     * Uses IntersectionObserver API for efficient scroll-based animations.
     * This approach is more performant than scroll event listeners as it
     * runs asynchronously and doesn't block the main thread.
     */
    private initAnimations(): void {
        const contactSection = this.elementRef.nativeElement;

        // Animate section title
        const title = contactSection.querySelector('.about-title');
        if (title) {
            this.animationsService.observeElement(title, {
                type: 'slideInUp',
                duration: 1000
            });
        }

        // Animate tabs container
        const tabsContainer = contactSection.querySelector('.contact-tabs');
        if (tabsContainer) {
            this.animationsService.observeElement(tabsContainer as HTMLElement, {
                type: 'fadeInUp',
                duration: 1200,
                delay: 300
            });
        }

        // Animate individual tabs with staggered delays
        // Staggering creates a cascade effect that's more visually appealing
        const tabs = contactSection.querySelectorAll('li[ngbNavItem]');
        tabs.forEach((tab: HTMLElement, index: number) => {
            this.animationsService.observeElement(tab, {
                type: 'scaleIn',
                delay: 600 + (index * 150)
            });

            // Add interactive hover effects for better UX feedback
            this.animationsService.addHoverEffects(tab, ['lift']);
        });

        // Delayed animation for content to ensure proper DOM rendering
        // setTimeout pushes to next event loop cycle after tab content renders
        setTimeout(() => {
            const contactItems = contactSection.querySelectorAll('.contact-item');
            contactItems.forEach((item: HTMLElement, index: number) => {
                this.animationsService.observeElement(item, {
                    type: 'fadeInLeft',
                    delay: index * 150
                });
            });
        }, 1000);
    }

}