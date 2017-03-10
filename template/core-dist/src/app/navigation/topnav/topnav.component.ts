import {Component, OnInit} from '@angular/core';
import {MdSidenav} from '@angular/material';
import {Input} from '@angular/core/src/metadata/directives';
import {NavigationService} from '../navigation.service';
import {Title} from '@angular/platform-browser';
import {AuthenticationService} from "../../authentication/authentication.service";
import {StringUtils} from '../../shared/utils/string-utils';
import {Router} from '@angular/router';
import {User} from '../../shared/models/user.model';
import {Acl} from '../../shared/models/acl.model';

@Component({
  selector : 'app-topnav',
  templateUrl : './topnav.component.html',
  styleUrls : ['./topnav.component.scss'],
  host: {'(document:click)': 'hideElements($event)'},
})
export class TopnavComponent implements OnInit {
  @Input() sideNav: MdSidenav;

  private _showSidenav: boolean;
  private _pageTitle: string;
  private _browserTitle: string;
  private _searchVal: string = '';
  private _searchValOld: string = '';
  private _isLoadingRoute: boolean = false;
  private _breadcrumbs: Array<{title: string, link: any[] | string}> = [];
  private _autoBreadcrumbs: boolean = true;

  private _breadcrumbInterval: number;
  private _pageTitleInterval: number;

  private _userProfile: User = new User();

  private showDropdown: boolean = false;
  private showSearchInput: boolean = false;
  private searchTerm: string;

  private activeAcl: Acl = new Acl();
  private showAcls: boolean = false;

  constructor(
    private _navigation: NavigationService,
    private _title: Title,
    private _authService: AuthenticationService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this._navigation.isRouteLoading.subscribe(isRouteLoading => {
      this._isLoadingRoute = isRouteLoading;
    });
    this._navigation.showSidenav.subscribe(showSidenav => {
      this._showSidenav = showSidenav;
    });
    this._navigation.breadcrumbs.subscribe(breadcrumbs => {
      if(breadcrumbs !== null) {
        window.clearInterval(this._breadcrumbInterval);
        this._autoBreadcrumbs = false;
        this._breadcrumbs = breadcrumbs;
      } else {
        if(this._isLoadingRoute) {
          this._breadcrumbInterval = window.setInterval(() => {
            if(!this._isLoadingRoute) {
              window.clearInterval(this._breadcrumbInterval);
              this.updateAutoBreadcrumbs();
            }
          });
        } else {
          this.updateAutoBreadcrumbs();
        }
      }
    });
    this._navigation.pageTitle.subscribe(pageTitle => {
      if(pageTitle !== null) {
        window.clearInterval(this._pageTitleInterval);
        this._pageTitle = pageTitle;
        if(this._browserTitle === null) {
          this._title.setTitle(this._navigation.getAutoBrowserTitle(pageTitle));
        }
      } else {
        if(this._isLoadingRoute) {
          this._pageTitleInterval = window.setInterval(() => {
            if(!this._isLoadingRoute) {
              window.clearInterval(this._pageTitleInterval);
              this.updatePageTitle();
            }
          });
        } else {
          this.updatePageTitle();
        }
      }
    });
    this._navigation.browserTitle.subscribe(browserTitle => {
      this._browserTitle = browserTitle;
      if(browserTitle !== null) {
        this._title.setTitle(browserTitle);
      } else {
        this._title.setTitle(this._navigation.getAutoBrowserTitle(this._pageTitle));
      }
    });

    this._authService.userData$.subscribe((userProfile: User) => {
      if (userProfile) {
        this._userProfile = userProfile;
      }
    });

    this._authService.activeAcl$.subscribe((acl: Acl) => this.activeAcl = acl);
  }

  searchBlur() {
    this._searchValOld = this._searchVal;
    this._searchVal = '';
  }

  searchFocus() {
    this._searchVal = this._searchValOld;
  }

  logout(){
    this._authService.logout();
  }

  changeAcl(acl: Acl): void {
    this._authService.changeActiveAcl(acl);
  }

  private updateAutoBreadcrumbs() {
    this._navigation.currentRoute.take(1).subscribe(currentRoute => {
      this._autoBreadcrumbs = true;
      this._breadcrumbs = this._navigation.getAutoBreadcrumbs(currentRoute);
    });
  }

  private updatePageTitle() {
    this._navigation.currentRoute.take(1).subscribe(currentRoute => {
      this._pageTitle = this._navigation.getAutoPageTitle(currentRoute);
      if(this._browserTitle === null) {
        this._title.setTitle(this._navigation.getAutoBrowserTitle(this._pageTitle));
      }
    });
  }

  private toggleAclsMenu(): void {
    this.showAcls = !this.showAcls;
  }

  private toggleDropdownMenu(): void {
    this.showDropdown = !this.showDropdown;
  }

  private toggleSearchInput(input: HTMLInputElement): void {
    this.showSearchInput = !this.showSearchInput;
    if(this.showSearchInput) {
      window.setTimeout(() => {
        input.focus();
      }, 0);
    }
  }

  searchInputBlur() {
    if(StringUtils.isEmpty(this.searchTerm)) {
      this.showSearchInput = false;
    }
  }

  private hideElements(event): void {
    if (!event.target.attributes.class || event.target.attributes.class.value !== 'topnav__profile__arrow material-icons') {
      this.showDropdown = false;
    }

    if (!event.target.attributes.class || event.target.attributes.class.value !== 'topnav__acl__arrow material-icons') {
      this.showAcls = false;
    }
  }

  search(event) {
    if (event.key === 'Enter' && this.searchTerm && this.searchTerm.length > 0) {
      this.router.navigate(['/dashboard', 'search', this.searchTerm])
    }
  }

  toggleSidenav(): void {
    this._navigation.toggleSidenav(!this._showSidenav);
  }
}
