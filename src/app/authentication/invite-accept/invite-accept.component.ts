import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {AcknowledgeInvite} from '../../shared/models/acknowledge-invite.model';
import {Acl} from '../../shared/models/acl.model';

@Component({
  selector: 'invite-accept',
  templateUrl: './invite-accept.component.html',
  styleUrls: ['./invite-accept.component.scss']
})
export class InviteAcceptComponent implements OnInit {

  hash: string;

  acknowledgeInvite: AcknowledgeInvite;

  welcomeScreen: boolean;
  completeScreen: boolean;
  showAclInstructions: boolean;
  showSignupInstructions: boolean;

  formInvalid: boolean;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.route.params.take(1).subscribe((params: Params) => {
      if (params['hash']) {
        this.hash = params['hash'];
        this.initiateAcknowledgeInvite();
      } else {
        this.logout();
      }
    });
  }

  acceptInvite(): void {
    this.authService.acceptInvite(this.acknowledgeInvite.hash, this.acknowledgeInvite.signature).subscribe((res: {isNew: string, account: string}) => {
      this.welcomeScreen = false;
      this.completeScreen = true;

      if (this.signupNeeded(res)) {
        this.showSignupInstructions = true;
      } else if (this.instructionsNeeded(res)) {
        this.showAclInstructions = true;
      }
    });
  }

  complete(): void {
    this.authService.refreshAfterAcceptInvite(new Acl({id: this.acknowledgeInvite.acl}));
  }

  logout(): void {
    this.authService.logout();
  }

  private signupNeeded(res) {
    return res.isNew;
  }

  private instructionsNeeded(res) {
    return !res.isNew;
  }

  private initiateAcknowledgeInvite() {
    this.authService.acknowledgeInvite(this.hash).subscribe(acknowledge => {
      this.acknowledgeInvite = acknowledge;
      this.welcomeScreen = true;
    });
  }
}
