import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {User} from '../../shared/models/user';
import {Address} from '../../shared/models/address.model';
import {CreditCard} from '../../shared/models/credit-card.model';

@Component({
  selector: 'c-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  private showScreen: boolean = false;

  private showWelcome: boolean = true;
  private showForm: boolean = false;
  private showTerms: boolean = false;
  private showThankYou: boolean = false;
  private selectedIndex: number = 0;

  private username: string;
  private usernameError: boolean = false;
  private firstName: string;
  private firstNameError: boolean = false;
  private lastName: string;
  private lastNameError: boolean = false;
  private company: string;
  private companyError: boolean = false;

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
  private ccNumberError: boolean = false;
  private ccExpMonth: string;
  private months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  private monthsMap = {'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6, 'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12};
  private ccExpYear: number;
  private years: number[] = [2017,2018,2019,2020,2021,2022,2023,2024,2025,2026,2027];
  private ccv: number;
  private ccvError: boolean = false;

  private fullName: string;
  private fullNameError: boolean = false;

  private approvalResent: boolean = false;
  private regInProcess: boolean = false;
  private userUnderRegistration: User;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.userUnderReg.subscribe((user: User) => {
      if (user !== null) {
        console.log(user);
        if (user.termsAndConditions === '0.1') {
          this.showThankYouScreen();
        } else {
          this.showWelcomeScreen();
        }

        this.showScreen = true;
        this.userUnderRegistration = user;
      }
    });
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
    if (this.selectedIndex === 0) {
      if (!this.validateUserDetails()) {
        return;
      }
    }

    if (this.selectedIndex === 2) {
      if (!this.validatePaymentDetails()) {
        return;
      }
    }

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
    if (this.fullName === `${this.firstName} ${this.lastName}`) {
      let address =  new Address({
        line1: this.address1,
        line2: this.address2,
        country: this.country,
        state: this.state,
        zip: this.postalCode,
        city: this.city});
      let user: User = this.userUnderRegistration.copy();
      user.name = this.fullName;
      user.address = address.copy();

      let cc: CreditCard = new CreditCard({
        id: this.ccNumber,
        ccnumber: this.ccNumber,
        expiration: this.monthsMap[this.ccExpMonth] + '/' + this.ccExpYear,
        ccv: this.ccv,
        name: this.fullName
      });
      cc.address = address.copy();

      this.regInProcess = true;
      this.authService.updateUserForRegistration(user, cc).subscribe(
        () => {
          this.regInProcess = false;
        },
        () => {
          this.regInProcess = false;
        }
      );
    } else {
      this.fullNameError = true;
    }
  }

  resendApproval(): void {
    this.approvalResent = true;
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
      return !!(this.address1 && this.country && this.state && this.city && this.postalCode)
    }

    if (index === 2) {
      return !!(this.ccNumber && this.ccExpMonth && this.ccExpYear && this.ccv);
    }

    if (index === 4) {
      return !!this.fullName;
    }

    return index === 3;
  }

  validateUserDetails(): boolean {
    if (!!(this.username && this.firstName && this.lastName && this.company)) {
      let valid: boolean = true;

      valid = this.username.length < 4 ? false : valid;
      this.usernameError = this.username.length < 4;

      valid = this.firstName.length < 2 ? false : valid;
      this.firstNameError = this.firstName.length < 2;

      valid = this.lastName.length < 2 ? false : valid;
      this.lastNameError = this.lastName.length < 2;

      valid = this.company.length <4 ? false : valid;
      this.companyError = this.company.length < 4;

      return valid;
    }

    return false;
  }

  validatePaymentDetails(): boolean {
    if (!!(this.ccNumber && this.ccExpMonth && this.ccExpYear && this.ccv)) {
      let valid: boolean = true;

      if (isNaN(this.ccNumber)) {
        valid = false;
        this.ccNumberError = true;
        this.ccNumber = null;
      }

      if (isNaN(this.ccv)) {
        valid = false;
        this.ccvError = true;
        this.ccv = null;
      }

      return valid;
    }

    return false;
  }

  checkCCNumber(event): void {
    if (this.isAllowedNumeric(event)) {
      this.ccNumberError = false;
    }
  }

  checkCcv(event): void {
    if (this.isAllowedNumeric(event)) {
      this.ccvError = false;
    }
  }

  isAllowedNumeric(event): boolean {
    const pattern = /[0-9]|Backspace|ArrowRight|ArrowLeft/;

    if (!pattern.test(event.key)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  isUsernameInvalid(): boolean {
    if (!this.usernameError) {
      return false;
    }

    return !this.username || this.username.length < 4;
  }

  isFirstNameInvalid(): boolean {
    if (!this.firstNameError) {
      return false;
    }

    return !this.firstName || this.firstName.length < 2;
  }

  isLastNameInvalid(): boolean {
    if (!this.lastNameError) {
      return false;
    }

    return !this.lastName || this.lastName.length < 2;
  }

  isCompanyInvalid(): boolean {
    if (!this.companyError) {
      return false;
    }

    return !this.company || this.company.length < 4;
  }

  isNumber(num: number): boolean {
    return !isNaN(num);
  }
}
