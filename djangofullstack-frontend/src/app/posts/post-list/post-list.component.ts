import { AuthService } from './../../auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { PostsService } from './../posts.service';
import { PostsModel } from './../posts.model';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: PostsModel[] = [];
  isLoading = true;
  userId: string;
  private postsSub: Subscription;

  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.postsService.getPosts();
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: { posts: PostsModel[] }) => {
        this.posts = posts.posts;
        this.isLoading = false;
      });
  }

  deletePost(id: number) {
    this.isLoading = true;
    this.postsService.deletePost(id);
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
