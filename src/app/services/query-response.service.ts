import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import markdownIt from 'markdown-it';


export interface MyApiResponse {
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class QueryResponseService {
  public http = inject(HttpClient);
  public sanitizer = inject(DomSanitizer)
  private chatHistory: BehaviorSubject<any> = new BehaviorSubject(null);

  apiUrl = 'http://127.0.0.1:8080/';
  getData(prompt: string): Observable<MyApiResponse> {
    return this.http.post<MyApiResponse>(this.apiUrl, { query: prompt });
  }

  async generateText(prompt: string) {
    this.chatHistory.next({
      from: 'user',
      message: prompt,
    });
    this.getData(prompt).subscribe((response) => {
      console.log(response);
      const md = markdownIt();

      this.chatHistory.next({
        from: 'bot',
        message: md.render(response.response),
      });
    });
  }

  public getChatHistory(): Observable<any> {
    return this.chatHistory.asObservable();
  }

}
