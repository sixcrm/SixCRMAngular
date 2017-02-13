import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'c-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  private showWelcome: boolean = true;
  private showForm: boolean = false;
  private showTerms: boolean = false;
  private showThankYou: boolean = false;
  private selectedIndex: number = 0;

  constructor() { }

  ngOnInit() {
  }

  showWelcomeScreen(): void {
    this.showWelcome = true;
    this.showForm = false;
    this.showTerms = false;
    this.showThankYou = false;
  }

  showFormScreen(): void {
    this.showWelcome = false;
    this.showForm = true;
    this.showTerms = false;
    this.showThankYou = false;
  }

  showTermsScreen(): void {
    this.showWelcome = false;
    this.showForm = false;
    this.showTerms = true;
    this.showThankYou = false;
  }

  showThankYouScreen(): void {
    this.showWelcome = false;
    this.showForm = false;
    this.showTerms = false;
    this.showThankYou = true;
  }

  next(): void {
    if  (this.selectedIndex === 3) {
      this.showTermsScreen();
    } else {
      this.selectedIndex++;
    }
  }

  previous(): void {
    if (this.showTerms) {
      this.selectedIndex = 3;
      this.showFormScreen();

      return;
    }

    if (this.selectedIndex === 0) {
      this.showWelcomeScreen();
    } else {
      this.selectedIndex--;
    }
  }

  complete(): void {
    this.showThankYouScreen();
  }
}
