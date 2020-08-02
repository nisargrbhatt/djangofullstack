import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { PostsService } from './../posts.service';
import { AuthService } from './../../auth/auth.service';
import { PostsModel } from './../posts.model';

@Component({
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStausSub: Subscription;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}
  ngOnInit() {
    this.authStausSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }
  onPostCreate(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const postData: PostsModel = {
      id: null,
      title: form.value.title,
      content: form.value.content,
      creator: form.value.creator,
    };
    this.postsService.createPost(postData);
  }
  ngOnDestroy() {
    this.authStausSub.unsubscribe();
  }
}
