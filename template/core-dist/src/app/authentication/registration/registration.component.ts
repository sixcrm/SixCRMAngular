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

  private username: string;
  private firstName: string;
  private lastName: string;
  private company: string;

  private address1: string;
  private address2: string;
  private country: string = 'USA';
  private countries: string[] = [];
  private state: string;
  private states: string[] = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
    'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
    'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];
  private city: string;
  private postalCode: string;

  private ccNumber: number;
  private ccExpMonth: string;
  private months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  private ccExpYear: number;
  private years: number[] = [2017,2018,2019,2020,2021,2022,2023,2024,2025,2026,2027];
  private ccv: string;

  private fullName: string;

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

  setCCExpMonth(month: string): void {
    this.ccExpMonth = month;
  }

  setCCExpYear(year: number): void {
    this.ccExpYear = year;
  }

  setCountry(country: string): void {
    this.country = country;
  }

  setState(state: string): void {
    this.state = state;
  }

  ccLastFour(): number {
    return this.ccNumber % 10000;
  }

  isValid(index: number): boolean {
    if (index === 0) {
      return !!(this.username && this.firstName && this.lastName && this.company);
    }

    if (index === 1) {
      return !!(this.address1 && this.address2 && this.country && this.state && this.city && this.postalCode)
    }

    if (index === 2) {
      return !!(this.ccNumber && this.ccExpMonth && this.ccExpYear && this.ccv);
    }

    if (index === 4) {
      return !!this.fullName;
    }

    return index === 3;
  }

  isNumber(num: number): boolean {
    return !isNaN(num);
  }
}
