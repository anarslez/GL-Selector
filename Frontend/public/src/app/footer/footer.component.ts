import { Component, OnInit } from '@angular/core';
declare var AOS: any;
declare var $: any;

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('.team').click(() => {
      console.log('Drizzy');
    });
  }

}
