import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule, CommonModule, LoaderComponent],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent {
  prompt: string = '';
  msgHistory: any = [];
  geminiService: GeminiService = inject(GeminiService);
  isLoading: boolean = false;
  constructor(public authService: AuthService) {
    this.geminiService.getChatHistory().subscribe((res) => {
      if (res) {
        this.msgHistory.push(res);
      }
    });
  }
  async sendData() {
    if (this.prompt) {
      this.isLoading = true;
      this.geminiService.generateText(this.prompt);
      this.prompt = '';
      this.isLoading = false;
    }
  }
}
