import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import { map, take } from 'rxjs/operators';

import { HttpService } from '../http.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';

declare var $: any;
declare var AOS: any;

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit, OnDestroy {

  @Input()

  inputs: object;
  // Inputs

  play = false;
  src_img: string;
  errors = null;
  face_shape = null;
  Object = Object;
  res_img: string;
  progress: boolean;
  user: any;
  userId: number;

  constructor(
    private _httpService: HttpService,
    private _authService: AuthService,
  ) { }

  ngOnInit() {
    if (this._authService.isLoggedIn) {
      this.user = this._authService.user.getValue();
      this.userId = this.user['id'];
    }
    // +++++++++++++++++++++++++++++++++++++++
    this.progress = false;
    AOS.init();
    // console.log('Naked ice cream');
    // console.log(this.inputs);
    if (this.inputs['send'] === true) {
      // console.log('Barbershop');
    }
    // console.log('Sicko Mode');
    const self = this;
    $('#take-picture').hide();
    // $('#send').hide();
    $('#cam').click(function () {
      // use MediaDevices API
      // docs: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
      if (navigator.mediaDevices) {
        console.log(navigator.mediaDevices);
        // access the web cam
        navigator.mediaDevices.getUserMedia({ video: true })
          // permission granted:
          .then(function (stream) {
            $('#take-picture').show();
            $(this).toggleClass('start');
            $('#cam i').toggleClass('play stop');
            video.srcObject = stream;
            const take_picture = document.getElementById('take-picture');
            take_picture.addEventListener('click', takeSnapshot);
            if (self.play) {
              stream.getTracks().forEach(track => track.stop());
              video.srcObject = null;
            }
            self.play = !self.play;
          })
          // permission denied:
          .catch(function (error) {
            document.body.textContent = 'Could not access the camera. Error: ' + error.name;
          });
      }

      function takeSnapshot() {
        let img: any;
        img = document.getElementById('capture');
        let context;
        const width = video.offsetWidth
          , height = video.offsetHeight;

        canvas = canvas || document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, width, height);
        self.src_img = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        self.src_img = canvas.toDataURL('image/png');
        // console.log(self.src_img);
        // $('#send').show();
        // console.log(newstr);
      }
    });
    let video: any;
    video = document.querySelector('#videoElement');
    let canvas: any;
    $('#take-picture').on('click', function(ev) {
      ev.preventDefault();
    });
    // $('#send').on('click', function(ev) {
    //   ev.preventDefault();
    //   self.sendImageFromService();
    //   $('.fart').modal('show');
    //   setTimeout(() => {
    //     $('.fart').modal('hide');
    //   }, 180000);
    // });
  }

  sendImageFromService() {
    const newstr = this.src_img.substring(22);
    const info = {demo: true, img_data: newstr, component: this.inputs['component']};
    let imgObservable: Observable<any>;
    if (!this.userId) {
      imgObservable = this._httpService.sendImage(info);
    } else {
      imgObservable = this._httpService.sendImage(info, this.userId);
    }
    imgObservable.subscribe((res: any) => {
      this.res_img = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
      this.res_img = 'data:image/jpeg;base64,' + res.image;
      if (Object.keys(res.error).length !== 0) {
        this.errors = res.error;
        this.face_shape = null;
      } else {
        this.progress = true;
        this.errors = null;
        this.face_shape = res.shape;
      }
    });
    $('.results').modal('show');
    $('.results').modal('attach events', '#close', 'hide');
  }

  ngOnDestroy() {
    $('.results').remove();
  }
}
