
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Analytics } from '../../../services/analytics/analytics';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-services',
    imports: [
        CarouselModule,
        TranslatePipe,
        CommonModule
    ],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class Services  implements OnInit {

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    navSpeed: 700,
    items: 1,
    autoplay: true,
    autoplayTimeout:3000
  }

  @ViewChild('imgContainer') imgContainer!: ElementRef;


  constructor(
    public analyticsService: Analytics
  ) { }

  ngOnInit(): void {



  }

debug(){

  this.imgContainer.nativeElement.scroll({
    top: this.imgContainer.nativeElement.scrollHeight,
    left: 0,
    behavior: 'smooth',    
  });
}

}

