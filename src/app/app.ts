import { RouterOutlet } from '@angular/router';
import {SplashScreen} from "./components/general/splash-screen/splash-screen";
import {Header} from "./components/general/header/header";
import {Footer} from "./components/general/footer/footer";
import { Component, OnInit, OnDestroy } from '@angular/core';
import Lenis from 'lenis';
import { Title, Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ParticlesService } from './services/particles/particles.service';
import { Language } from './services/language/language.service';
import {Loading} from "./services/loading/loading.service";




@Component({
  selector: 'app-root',
    imports: [RouterOutlet, SplashScreen, Header, Footer],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
    title = 'vorster-forb-portfolio';
    appContentVisible = false;
    private lenis!: Lenis;

    constructor(
        private titleService: Title,
        private metaService: Meta,
        private translateService: TranslateService,
        private location: Location,
        private languageService: Language,
        private particlesService: ParticlesService,
        private loadingService: Loading
    ) {}

    ngOnInit(): void {
        // Initialize language service first
        this.languageService.initLanguage();

        // Set dynamic meta tags after language initialization
        this.setDynamicMetadata();

        // Initialize particles with slight delay for DOM readiness
        setTimeout(() => {
            this.particlesService.init();
        }, 100);
    }

    /**
     * Sets page title and meta tags dynamically based on current language
     * Complexity: O(1) - Direct translation lookups and meta tag updates
     */
    private setDynamicMetadata(): void {
        // Subscribe to translation service to get localized metadata
        this.translateService.get([
            'Meta.Title',
            'Meta.Keywords',
            'Meta.Description'
        ]).subscribe(translations => {
            // Set page title
            this.titleService.setTitle(translations['Meta.Title']);


            // Update meta tags (removes duplicates automatically)
            this.metaService.updateTag({
                name: 'keywords',
                content: translations['Meta.Keywords']
            });

            this.metaService.updateTag({
                name: 'description',
                content: translations['Meta.Description']
            });
        });
    }

    /**
     * Initializes Lenis smooth scrolling library
     * Complexity: O(1) - Single initialization with RAF loop
     *
     * Configuration rationale:
     * - duration: 1.2s provides balanced smoothness vs responsiveness
     * - easing: Exponential decay for natural deceleration
     * - smoothWheel: Enhanced trackpad/mouse wheel experience
     * - syncTouch: Disabled to prevent mobile scroll conflicts
     */
    private initLenis(): void {
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            gestureOrientation: 'vertical',
            smoothWheel: true,
            syncTouch: false
        });

        // Request animation frame loop for smooth scrolling
        const raf = (time: number) => {
            this.lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
    }

    ngOnDestroy(): void {
        // Clean up Lenis instance to prevent memory leaks
        if (this.lenis) {
            this.lenis.destroy();
        }

        // Destroy particle system
        this.particlesService.destroy();
    }

    /**
     * Callback triggered when splash screen animation completes
     * Initializes scroll behavior and triggers content animations
     */
    onSplashAnimationCompleted(): void {
        this.appContentVisible = true;

        // Slight delay ensures DOM is fully painted before scroll initialization
        setTimeout(() => {
            this.initLenis();
        }, 100);

        this.loadingService.startAnimations();
    }
}


