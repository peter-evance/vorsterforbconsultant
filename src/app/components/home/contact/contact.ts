
import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Analytics } from '../../../services/analytics/analytics';
import { Animations } from '../../../services/animations/animations';
import {TranslatePipe} from "@ngx-translate/core";
import {DynamicButton} from "../../general/dynamic-button/dynamic-button";
import {ContactOffice} from "../contact-office/contact-office";

@Component({
    selector: 'app-contact',
    templateUrl: './contact.html',
    imports: [
        TranslatePipe,
        DynamicButton,
        ContactOffice
    ],
    styleUrls: ['./contact.scss']
})
export class Contact implements OnInit, AfterViewInit {

  constructor(
    public analyticsService: Analytics,
    private animationsService: Animations,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  private initAnimations(): void {
    const contactSection = this.elementRef.nativeElement;

    // Animar contenedor del título
    const titleContainer = contactSection.querySelector('.mb-4');
    if (titleContainer) {
      this.animationsService.observeElement(titleContainer, {
        type: 'fadeInDown',
        duration: 1000
      });
    }

    // Animar título principal con typewriter
    const mainTitle = contactSection.querySelector('.contact-title');
    if (mainTitle) {
      this.animationsService.observeElement(mainTitle, {
        type: 'typewriter',
        delay: 500
      });
    }

    // Animar párrafo de descripción
    const description = contactSection.querySelector('p');
    if (description) {
      this.animationsService.observeElement(description, {
        type: 'morphIn',
        duration: 1200,
        delay: 2500
      });
    }

    // Animar botón de contacto
    const contactButton = contactSection.querySelector('.contact-btn');
    if (contactButton) {
      this.animationsService.observeElement(contactButton.parentElement as HTMLElement, {
        type: 'scaleIn',
        duration: 800,
        delay: 3500
      });

      // Añadir efectos hover especiales al botón
      this.animationsService.addHoverEffects(contactButton as HTMLElement, ['lift', 'glow']);
    }
  }
}

