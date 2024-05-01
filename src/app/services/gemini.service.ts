import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private generativeAI: GoogleGenerativeAI;
  constructor() {
    this.generativeAI = new GoogleGenerativeAI(
      'AIzaSyABzSBSJq0Uy-1tg88_gB7q91J5yCjcmtI'
    );
  }
  private chatHistory: BehaviorSubject<any> = new BehaviorSubject(null);

  async generateText(prompt: string) {
    this.chatHistory.next({
      from: 'user',
      message: prompt,
    });
    const model = this.generativeAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textData = await response.text();
    console.log(textData);
    this.chatHistory.next({
      from: 'bot',
      message: textData,
    });
  }

  public getChatHistory(): Observable<any> {
    return this.chatHistory.asObservable();
  }
}
