import { Component, ElementRef, ViewChild, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import lottie, { AnimationItem } from 'lottie-web';

@Component({
    selector: 'app-splash-screen',
    imports: [],
    templateUrl: './splash-screen.html',
    styleUrl: './splash-screen.scss'
})
export class SplashScreen implements OnInit, OnDestroy {
    @ViewChild('lottieContainer', { static: true }) lottieContainer!: ElementRef;
    @Output() animationCompleted = new EventEmitter<void>();

    isHidden = false;
    loadingText = 'Loading...';

    private lottieAnimation: AnimationItem | null = null;
    private minimumLoadingTime = 1800;
    private splashTimeout?: number;

    // Color mapping: Original Lottie colors → Your theme colors
    private readonly colorMap: Record<string, string> = {
        // Cyan/bright green → Primary golden-brown
        '#00FFDA': '#b8860b',
        '#00ffc4': '#b8860b',

        // Green → Light goldenrod
        '#64FFDA': '#daa520',
        '#64ffc4': '#daa520',

        // Teal → Darker golden-brown
        '#10E0B0': '#8b6914',
        '#10e0b0': '#8b6914',

        // Normalized RGB values (0-1 range in Lottie)
        // Cyan [0, 1, 0.767] → Golden-brown [0.722, 0.525, 0.043]
        // Green [0.392, 1, 0.855] → Light goldenrod [0.855, 0.647, 0.125]
        // Teal [0.061, 0.879, 0.688] → Dark golden-brown [0.545, 0.412, 0.078]
    };

    constructor(private translate: TranslateService) {}

    ngOnInit(): void {
        this.setupTranslations();
        this.initLottieAnimation();
        this.startSplashTimer();
    }

    ngOnDestroy(): void {
        if (this.lottieAnimation) {
            this.lottieAnimation.destroy();
        }
        if (this.splashTimeout) {
            clearTimeout(this.splashTimeout);
        }
    }

    private setupTranslations(): void {
        this.translate.get('Loading').subscribe((text: string) => {
            this.loadingText = text || 'Loading...';
        });
    }

    private async initLottieAnimation(): Promise<void> {
        try {
            // Fetch and modify animation data
            const response = await fetch('assets/lotties/loader.json');
            const animationData = await response.json();

            // Apply color replacements
            const modifiedData = this.replaceColors(animationData);

            this.lottieAnimation = lottie.loadAnimation({
                container: this.lottieContainer.nativeElement,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: modifiedData // Use modified data instead of path
            });

            this.lottieAnimation.addEventListener('error', (error: any) => {
                console.warn('Lottie animation error:', error);
            });
        } catch (error) {
            console.warn('Error initializing Lottie animation:', error);
            // Fallback: show loading text only
        }
    }

    /**
     * Recursively traverse animation data and replace color values.
     * Handles both hex strings and normalized RGB arrays [r, g, b, a?].
     *
     * Time Complexity: O(n) where n = total properties in JSON
     */
    private replaceColors(obj: any): any {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (Array.isArray(obj)) {
            // Check if this is a color array [r, g, b] or [r, g, b, a]
            if (obj.length >= 3 && obj.length <= 4 &&
                obj.every(v => typeof v === 'number' && v >= 0 && v <= 1)) {
                return this.convertColorArray(obj);
            }
            return obj.map(item => this.replaceColors(item));
        }

        const result: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];

                // Check for hex color strings
                if (typeof value === 'string' && /^#[0-9A-Fa-f]{6}$/i.test(value)) {
                    result[key] = this.colorMap[value.toLowerCase()] || value;
                } else {
                    result[key] = this.replaceColors(value);
                }
            }
        }
        return result;
    }

    /**
     * Convert Lottie RGB array to your theme colors.
     * Lottie uses normalized values [0-1], we convert to hex for comparison.
     */
    private convertColorArray(color: number[]): number[] {
        const hex = this.rgbArrayToHex(color);
        const mappedHex = this.colorMap[hex.toLowerCase()];

        if (mappedHex) {
            return this.hexToRgbArray(mappedHex, color.length === 4 ? color[3] : undefined);
        }
        return color;
    }

    private rgbArrayToHex(rgb: number[]): string {
        const r = Math.round(rgb[0] * 255);
        const g = Math.round(rgb[1] * 255);
        const b = Math.round(rgb[2] * 255);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    private hexToRgbArray(hex: string, alpha?: number): number[] {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return alpha !== undefined ? [r, g, b, alpha] : [r, g, b];
    }

    private startSplashTimer(): void {
        this.splashTimeout = window.setTimeout(() => {
            this.checkIfReadyToHide();
        }, this.minimumLoadingTime);
    }

    private checkIfReadyToHide(): void {
        if (document.readyState === 'complete') {
            this.hideSplashScreen();
        } else {
            window.addEventListener('load', () => {
                this.hideSplashScreen();
            }, { once: true });
            setTimeout(() => {
                this.hideSplashScreen();
            }, 2000);
        }
    }

    private hideSplashScreen(): void {
        if (this.isHidden) return;

        this.isHidden = true;

        setTimeout(() => {
            this.animationCompleted.emit();
        }, 800);
    }
}