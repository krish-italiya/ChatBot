import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { QueryResponseService } from '../../services/query-response.service';
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
  queryResponse: QueryResponseService = inject(QueryResponseService)
  isLoading: boolean = false;
  constructor(public authService: AuthService) {
    this.queryResponse.getChatHistory().subscribe((res) => {
      if (res) {
        this.msgHistory.push(res);
      }
    });
  }
  async sendData() {
    if (this.prompt) {
      this.isLoading = true;
      this.queryResponse.generateText(this.prompt);
      this.prompt = '';
      this.isLoading = false;
    }
  }
}
