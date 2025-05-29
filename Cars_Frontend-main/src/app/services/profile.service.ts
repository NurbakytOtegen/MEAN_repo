// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs';
// import { Review } from '../models/review.model';
// import { User } from '../models/user.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProfileService {

//   constructor(private http: HttpClient) { }

//   getProfile(): Observable<{user: User, reviews: Review[]}> {
//     return this.http.get<any>('http://localhost:8081/api/profile');
//   }

//   updateProfile(data: {name: string, password: string}): Observable<any> {
//     return this.http.put<any>('http://localhost:8081/api/profile', data);
//   }
// }
