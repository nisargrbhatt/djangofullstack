import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { PostsModel } from './posts.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  BACKEND_URL = 'http://localhost:8000/posts/';

  private posts = [];
  private postsUpdated = new Subject<{ posts: PostsModel[] }>();

  constructor(private http: HttpClient, private router: Router) {}

  createPost(postData: PostsModel) {
    this.http
      .post<{ message: string }>(this.BACKEND_URL + 'create/', postData)
      .subscribe(
        (message) => {
          // console.log(message);
          this.router.navigate(['/']);
        },
        (error) => {
          console.error(error);
        }
      );
  }
  getPosts() {
    this.http
      .get<{ postsData: PostsModel[] }>(this.BACKEND_URL + 'list/')
      .subscribe(
        (postsData: any) => {
          // console.log(postsData);

          this.posts = postsData;
          this.postsUpdated.next({
            posts: [...this.posts],
          });
        },
        (error) => {
          console.error(error);
        }
      );
  }
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  deletePost(id: number) {
    this.http
      .delete<{ message: string }>(this.BACKEND_URL + 'delete/' + id)
      .subscribe(
        (message) => {
          // console.log(message);
          this.getPosts();
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
