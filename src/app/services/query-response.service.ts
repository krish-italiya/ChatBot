import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import markdownIt from 'markdown-it';

export interface MyApiResponse {
  response: string;
  plot_detail: string;
}

@Injectable({
  providedIn: 'root',
})
export class QueryResponseService {
  public http = inject(HttpClient);
  public sanitizer = inject(DomSanitizer);
  private chatHistory: BehaviorSubject<any> = new BehaviorSubject(null);

  apiUrl = 'http://127.0.0.1:8080/';
  getData(prompt: string): Observable<MyApiResponse> {
    console.log(prompt);
    const res = this.http.post<MyApiResponse>(this.apiUrl, { query: prompt });
    return res;
  }

  async generateText(prompt: string) {
    this.chatHistory.next({
      from: 'user',
      message: prompt,
    });
    console.log('Before response');
    this.getData(prompt).subscribe((response) => {
      console.log(response.plot_detail);
      const md = markdownIt();
      if(response.plot_detail){
        this.chatHistory.next({
          from: 'bot',
          message: md.render(response.response),
          img_data: this.sanitizer.bypassSecurityTrustResourceUrl(
            `data:image/png;base64,${response.plot_detail}`
          ),
        });
      }
      else{
        this.chatHistory.next({
          from: 'bot',
          message: md.render(response.response),
          img_data: ""
        });

      }
    });
    console.log('After response');
  }

  public getChatHistory(): Observable<any> {
    return this.chatHistory.asObservable();
  }
}
