import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AuthenticationService} from '../authentication.service';
import {User} from '../../shared/models/user.model';

@Component({
  selector: 'registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {

  @Input() embedded: boolean = false;
  @Output() completed: EventEmitter<boolean> = new EventEmitter();

  formInvalid: boolean;

  company: string;
  firstName: string;
  lastName: string;

  showSuccessMessage: boolean = false;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    let payload = this.authService.getPayload();

    this.firstName = payload.given_name;
    this.lastName = payload.family_name;
  }

  submitRegistrationData(valid: boolean): void {
    this.formInvalid = !valid;
    if (this.formInvalid) return;

    this.authService.updateCurrentAccount(this.company).subscribe(() => {
      this.register();
    });
  }

  register() {
    this.authService.registerUser(this.company, this.firstName, this.lastName).subscribe(res => {
      let user = new User(res.json().response.data.updateuser);
      this.authService.updateSixUser(user);
      this.authService.refreshActiveAcl();

      this.showSuccessMessage = true;
    })
  }

  complete(): void {
    if (this.embedded) {
      this.completed.emit(true);
    } else {
      this.authService.setActive(true);
    }
  }

}
