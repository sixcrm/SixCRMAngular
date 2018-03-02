import {Component, OnInit, OnDestroy} from '@angular/core';
import {TabHeaderElement} from '../../../shared/components/tab-header/tab-header.component';
import {AclsService} from '../../../shared/services/acls.service';
import {Role} from '../../../shared/models/role.model';
import {RolesService} from '../../../shared/services/roles.service';
import {CustomServerError} from '../../../shared/models/errors/custom-server-error';
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit, OnDestroy {

  tabHeaders: TabHeaderElement[] = [
    {name: 'custom', label: 'ROLE_TAB_CUSTOM'},
    {name: 'shared', label: 'ROLE_TAB_SHARED'}
  ];

  selectedIndex: number = 0;

  showAddModal: boolean;

  sub: Subscription;

  constructor(
    public aclService: AclsService,
    private roleService: RolesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.aclService.getEntities();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  setIndex(value: number) {
    this.selectedIndex = value;
  }

  overlayClicked(event: any): void {
    if (event && event.target && event.target.className === 'full-overlay') {
      this.toggleAddModal();
    }
  }

  createEntity(role: Role) {
    this.sub = this.roleService.entityCreated$.take(1).subscribe(role => {
      if (role instanceof CustomServerError) return;

      this.router.navigate([role.id], {relativeTo: this.route});
    });

    this.roleService.createEntity(role);
  }

  toggleAddModal() {
    this.showAddModal = !this.showAddModal;
  }
}
