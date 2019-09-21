import { Component, OnInit } from '@angular/core';
import { MethodCall } from '@angular/compiler';
declare var $: any;
declare var AOS: any;

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit {
  play = false;
  src_img = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  errors = null;
  face_shape = null;
  Object = Object;
  inputs: any;
  res_img = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

  constructor() { }

  ngOnInit() {
    this.inputs = { show: true, send: false, component: 'demo' };
    console.log('ASAP ROCKY');
    const self = this;
    $('.body').hide();
    $('#demo').click(function () {
      console.log('Take Care');
      const rate = 700;
      if (self.inputs.show) {
        $('.body').slideDown(rate);
      } else {
        $('.body').slideUp(rate);
      }
      self.inputs.show = !self.inputs.show;
    });
  }
}
