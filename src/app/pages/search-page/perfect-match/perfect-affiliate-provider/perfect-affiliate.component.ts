import {Component, OnInit, OnDestroy} from '@angular/core';
import {AbstractPerfectMatch} from '../abstract-perfect-match.component';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';
import {Affiliate} from '../../../../shared/models/affiliate.model';
import {AffiliatesService} from '../../../../shared/services/affiliates.service';

@Component({
  selector: 'perfect-affiliate',
  templateUrl: './perfect-affiliate.component.html',
  styleUrls: ['./perfect-affiliate.component.scss']
})
export class PerfectAffiliateComponent extends AbstractPerfectMatch implements OnInit, OnDestroy {

  affiliate: Affiliate;

  constructor(private affiliateService: AffiliatesService) {
    super();
  }

  ngOnInit() {
    this.affiliateService.entity$.takeUntil(this.unsubscribe$).subscribe(affiliate => {
      if (affiliate instanceof CustomServerError) {
        this.serverError = affiliate;
        return;
      }

      this.serverError = null;
      this.affiliate = affiliate
    });

    this.affiliateService.getEntity(this.id);
  }

  ngOnDestroy() {
    this.destroy();
  }

}
