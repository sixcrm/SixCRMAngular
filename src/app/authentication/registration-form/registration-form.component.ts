import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {User} from '../../shared/models/user.model';

@Component({
  selector: 'registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {

  formInvalid: boolean;

  firstName: string;
  lastName: string;
  company: string;

  showSuccessMessage: boolean = false;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
  }

  submitRegistrationData(valid: boolean): void {
    this.formInvalid = !valid;
    if (this.formInvalid) return;

    this.authService.registerUser(this.company, this.firstName, this.lastName).subscribe(res => {
      let user = new User(res.json().response.data.updateuser);
      this.authService.updateSixUser(user);

      this.showSuccessMessage = true;
    })
  }

  complete(): void {
    this.authService.setActive(true);
  }

}
