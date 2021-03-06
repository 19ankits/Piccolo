import { Component, OnInit, OnChanges } from '@angular/core';
import { ImageService } from '../services/image.service';
import { ActivatedRoute } from '@angular/router';
import { ImageDetails } from '../models/imageDetails.model';
import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Upload } from '../models/upload.model';
import { UploadService } from '../services/upload.service';
import { Comment } from '../models/comment.model';
import * as firebase from 'firebase';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  private imageUrl = '';
  private objRef = '';
  private rootDir = '';
  comment: Comment;
  private ngFire: AngularFireModule;
  private dbObject: AngularFireDatabase;
  private fileUpload: ImageDetails;

  constructor(private imageService: ImageService, private route: ActivatedRoute, private uploadService: UploadService) { }

  getUrl(key: string) {
    this.imageService.getImage(key)
      .then(image => this.imageUrl = image.url);
  }

  getFileUpload(key: string) {
    this.imageService.getImage(key)
      .then(imageUpload => this.fileUpload = imageUpload);
  }

  ngOnInit() {
    this.getUrl(this.route.snapshot.params['id']);
    this.getFileUpload(this.route.snapshot.params['id']);
  }

  deleteFileUpload() {
    console.log(this.route.snapshot.params['id']);
    console.log(this.fileUpload.name);
    console.log(this.fileUpload);
    console.log('inside deleteFileUpload');
    this.uploadService.removeUpload(this.fileUpload, this.route.snapshot.params['id']);
  }

  likeImage() {
    const keyi = this.route.snapshot.params['id'];
    console.log(this.fileUpload.like);
    const count = this.fileUpload.like + 1;
    console.log(count);
    const user = this.imageService.getUserId();               // returns logged-in userid
    const db = firebase.database();
    console.log('/uploads' + '/' + user + '/' + keyi);
    db.ref('/uploads' + '/' + user + '/' + keyi).update({like: count});
  }

  dislikeImage() {
    const keyi = this.route.snapshot.params['id'];
    console.log(this.fileUpload.dislike);
    const count = this.fileUpload.dislike + 1;
    console.log(count);
    const user = this.imageService.getUserId();
    const db = firebase.database();
    console.log('/uploads' + '/' + user + '/' + keyi);
    db.ref('/uploads' + '/' + user + '/' + keyi).update({dislike: count});
  }

  // addComment() {
  //   console.log('Image key is :' + this.route.snapshot.params['id']);
  //   this.objRef = this.route.snapshot.params['id'];
  //   // console.log(this.objRef);
  //   var comments = (<HTMLInputElement>document.getElementById('comment')).value;
  //   console.log(comments)
  //   console.log('Inside addComment')
  //   const user = this.imageService.getUserId();
  //   console.log(user);
  //   this.comment.author = user.toString();
  //   this.comment.data = comments;
  //   // this.rootDir = '/uploads/' + this.objRef;
  //   // console.log(this.rootDir);
  //   // const storageRef = firebase.storage().ref();    
  //   // console.log(storageRef);
  //   // this.comment.author = 'Rahul';
  //   // this.comment.data = 'Helllooo';
  //   var path = '/uploads/' + user + '/' + this.objRef + '/' +'comment';
  //   this.writeCommentData(this.comment, path);
  // }

  //   private writeCommentData(comment: Comment, path: string) {

  //     this.dbObject.list(path).push(comment);
  //     console.log('Comment saved!: ' + comment);
  //   }
}
