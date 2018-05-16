import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {AuthenticationService} from '../authentication.service';
import {AcknowledgeInvite} from '../../shared/models/acknowledge-invite.model';
import {Acl} from '../../shared/models/acl.model';
import {environment} from '../../../environments/environment';

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

  formInvalid: boolean;

  registrationLogo = environment.branding ? environment.branding.registrationLogo : 'logo-registration.svg';

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
    this.authService.acceptInvite(this.acknowledgeInvite.hash, this.acknowledgeInvite.signature).subscribe((res: {isNew: boolean, account: string}) => {
      this.authService.refreshAfterAcceptInvite(new Acl({id: this.acknowledgeInvite.acl}), res.isNew);
    });
  }

  complete(): void {
  }

  logout(): void {
    this.authService.logout();
  }

  private initiateAcknowledgeInvite() {
    this.authService.acknowledgeInvite(this.hash).subscribe(acknowledge => {
      this.acknowledgeInvite = acknowledge;
      this.welcomeScreen = true;
    });
  }
}
