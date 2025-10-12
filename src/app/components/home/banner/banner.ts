import { Component, OnInit, AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { Subscription } from 'rxjs';
import { Analytics } from '../../../services/analytics/analytics';
import { Loading } from '../../../services/loading/loading.service';
import { DynamicButton } from "../../general/dynamic-button/dynamic-button";
import { TranslatePipe } from "@ngx-translate/core";

interface AnimationConfig {
    delay: number;
    duration?: number;
    element: string;
    action: () => void;
}

@Component({
    selector: 'app-banner',
    templateUrl: './banner.html',
    imports: [
        NgOptimizedImage,
        DynamicButton,
        TranslatePipe
    ],
    styleUrl: './banner.scss'
})
export class Banner implements OnInit, AfterViewInit, OnDestroy {

    private readonly animationTimings = {
        pretitle: 100,
        name: 600,
        subtitle: 1600,
        description: 2200,
        button: 2800
    };

    private readonly typewriterConfig = {
        speed: 80,
        cursorBlinkRate: 500
    };

    private animationTimeouts: number[] = [];
    private animationsStarted = false;
    private loadingSubscription?: Subscription;

    constructor(
        public analyticsService: Analytics,
        private elementRef: ElementRef,
        private loadingService: Loading
    ) { }

    ngOnInit(): void {
        this.loadingSubscription = this.loadingService.animationsStarted$.subscribe((shouldStart) => {
            if (shouldStart && !this.animationsStarted) {
                this.animationsStarted = true;
                this.initAnimations();
                this.showBackground();
            }
        });
    }

    ngAfterViewInit(): void {
        if (this.loadingService.animationsStarted && !this.animationsStarted) {
            this.animationsStarted = true;
            this.initAnimations();
            this.showBackground();
        }
    }

    ngOnDestroy(): void {
        this.clearAllTimeouts();
        if (this.loadingSubscription) {
            this.loadingSubscription.unsubscribe();
        }
    }

    private initAnimations(): void {
        const banner = this.elementRef.nativeElement;

        const animations: AnimationConfig[] = [
            {
                delay: this.animationTimings.pretitle,
                element: '.banner-pretitle h1',
                action: () => this.animatePretitle(banner)
            },
            {
                delay: this.animationTimings.name,
                element: '.banner-name',
                action: () => this.animateTypewriter(banner)
            },
            {
                delay: this.animationTimings.description,
                element: '.banner-description',
                action: () => this.animateMorph(banner)
            },
            {
                delay: this.animationTimings.button,
                element: '.main-btn',
                action: () => this.animateButton(banner)
            }
        ];

        this.executeAnimations(animations);
    }

    private executeAnimations(animations: AnimationConfig[]): void {
        animations.forEach(animation => {
            const timeoutId = window.setTimeout(() => {
                animation.action();
            }, animation.delay);

            this.animationTimeouts.push(timeoutId);
        });
    }

    private animatePretitle(banner: HTMLElement): void {
        const pretitle = banner.querySelector('.banner-pretitle h1') as HTMLElement;
        if (!pretitle) return;

        pretitle.style.opacity = '1';
        pretitle.style.transform = 'translateY(0)';
    }

    private animateTypewriter(banner: HTMLElement): void {
        const nameElement = banner.querySelector('.banner-name') as HTMLElement;
        if (!nameElement) return;

        const originalText = nameElement.textContent || '';
        nameElement.innerHTML = `<span class="typed-text"></span><span class="cursor">|</span>`;

        const typedTextElement = nameElement.querySelector('.typed-text') as HTMLElement;
        const cursorElement = nameElement.querySelector('.cursor') as HTMLElement;

        nameElement.style.opacity = '1';

        this.startCursorBlink(cursorElement);
        this.startTypeEffect(typedTextElement, originalText);
    }

    private startCursorBlink(cursorElement: HTMLElement): void {
        let cursorVisible = true;
        setInterval(() => {
            cursorElement.style.opacity = cursorVisible ? '0' : '1';
            cursorVisible = !cursorVisible;
        }, this.typewriterConfig.cursorBlinkRate);
    }

    private startTypeEffect(textElement: HTMLElement, text: string): void {
        let charIndex = 0;

        const typeInterval = setInterval(() => {
            textElement.textContent = text.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex >= text.length) {
                clearInterval(typeInterval);
            }
        }, this.typewriterConfig.speed);
    }

    private animateMorph(banner: HTMLElement): void {
        const description = banner.querySelector('.banner-description') as HTMLElement;
        if (!description) return;

        description.style.setProperty('opacity', '0', 'important');
        description.style.setProperty('transform', 'translateY(20px)', 'important');
        description.style.setProperty('filter', 'blur(3px)', 'important');
        description.style.setProperty('transition', 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)', 'important');

        requestAnimationFrame(() => {
            description.style.setProperty('opacity', '1', 'important');
            description.style.setProperty('transform', 'translateY(0)', 'important');
            description.style.setProperty('filter', 'blur(0px)', 'important');
        });
    }

    private animateButton(banner: HTMLElement): void {
        const button = banner.querySelector('.main-btn') as HTMLElement;
        if (!button) return;

        button.style.opacity = '1';
        button.style.transform = 'scale(1)';
    }

    private showBackground(): void {
        const backgroundImage = this.elementRef.nativeElement.querySelector('.banner-background') as HTMLElement;
        if (backgroundImage) {
            backgroundImage.classList.add('loaded');
        }

        const overlay = this.elementRef.nativeElement.querySelector('.banner-overlay') as HTMLElement;
        if (overlay) {
            overlay.classList.add('loaded');
        }
    }

    private clearAllTimeouts(): void {
        this.animationTimeouts.forEach(id => clearTimeout(id));
        this.animationTimeouts = [];
    }

    public updateAnimationTiming(element: keyof typeof this.animationTimings, delay: number): void {
        (this.animationTimings as any)[element] = delay;
    }

    public updateTypewriterSpeed(speed: number): void {
        this.typewriterConfig.speed = speed;
    }

    public updateCursorBlinkRate(rate: number): void {
        this.typewriterConfig.cursorBlinkRate = rate;
    }
}