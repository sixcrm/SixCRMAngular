import {Component, OnInit, OnDestroy} from '@angular/core';
import {Rebill} from '../../../../shared/models/rebill.model';
import {AbstractPerfectMatch} from '../abstract-perfect-match.component';
import {RebillsService} from '../../../../shared/services/rebills.service';
import {CustomServerError} from '../../../../shared/models/errors/custom-server-error';

@Component({
  selector: 'perfect-rebill',
  templateUrl: './perfect-rebill.component.html',
  styleUrls: ['./perfect-rebill.component.scss']
})
export class PerfectRebillComponent extends AbstractPerfectMatch implements OnInit, OnDestroy {

  rebill: Rebill;

  constructor(private rebillsService: RebillsService) {
    super();
  }

  ngOnInit() {
    this.rebillsService.entity$.takeUntil(this.unsubscribe$).subscribe(rebill => {
      if (rebill instanceof CustomServerError) {
        this.serverError = rebill;
        return;
      }

      this.serverError = null;
      this.rebill = rebill
    });

    this.rebillsService.getEntity(this.id);
  }

  ngOnDestroy() {
    this.destroy();
  }
}
