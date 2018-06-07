import {Component, OnInit, ViewChild, Input, Output, EventEmitter} from '@angular/core';
import {NavigationService} from '../navigation.service';
import {AuthenticationService} from "../../authentication/authentication.service";
import {Router} from '@angular/router';
import {User} from '../../shared/models/user.model';
import {Acl} from '../../shared/models/acl.model';
import {SearchService} from '../../shared/services/search.service';
import {NotificationsQuickService} from '../../shared/services/notifications-quick.service';
import {AutocompleteComponent} from '../../shared/components/autocomplete/autocomplete.component';
import {TopnavDropdownOption} from './topnav-dropdown/topnav-dropdown.component';
import {FeatureFlagService} from "../../authentication/feature-flag.service";

@Component({
  selector : 'app-topnav',
  templateUrl : './topnav.component.html',
  styleUrls : ['./topnav.component.scss'],
  host: {'(document:click)': 'hideElements($event)'},
})
export class TopnavComponent implements OnInit {
  @ViewChild('autocomplete') autocomplete: AutocompleteComponent;

  @Input() isInvitedUser: boolean;
  @Input() focused: boolean = false;
  @Output() invitedUserInstructionsDismissed: EventEmitter<boolean> = new EventEmitter();

  showSidenav: boolean;

  userProfile: User = new User();

  showCollapseMenu: boolean = false;
  showAutoComplete: boolean = false;
  searchTerm: string = '';
  options: string[] = [];

  notificationsCount: number;

  mapAcl = (acl: Acl) => acl.account.name;

  addOptions: TopnavDropdownOption[] = [
    {label: 'New Order', callback: () => this.navigation.setShowCreateNewOrderModal(true)},
    {label: 'New Campaign', callback: () => this.router.navigate(['campaigns'], {queryParams: {action: 'new'}})},
    {label: 'New Product Schedule', callback: () => this.router.navigate(['productschedules'], {queryParams: {action: 'new'}})},
    {label: 'New Product', callback: () => this.router.navigate(['products'], {queryParams: {action: 'new'}})},
    {label: 'New Merchant', callback: () => this.router.navigate(['merchantproviders'], {queryParams: {action: 'new'}})},
    {label: 'New Merchant Group', callback: () => this.router.navigate(['merchantprovidergroups'], {queryParams: {action: 'new'}})},
  ];

  supportOptions: TopnavDropdownOption[] = [
    {label: 'API documentation', callback: () => {
      let graphDocumentationRoute = 'graph';

      if (this.featureFlagService.isEnabled('graphdocs-2.0')) {
        graphDocumentationRoute = 'graph2';
      }

      this.router.navigate(['documentation', graphDocumentationRoute])}
    },
    {label: 'Support', callback: () => window.open('https://six.zendesk.com', '_blank').focus()}
  ];

  constructor(
    public navigation: NavigationService,
    public authService: AuthenticationService,
    private router: Router,
    private searchService: SearchService,
    private notificationsService: NotificationsQuickService,
    private featureFlagService: FeatureFlagService
  ) { }

  ngOnInit() {
    this.navigation.showSidenav.subscribe(showSidenav => {
      this.showSidenav = showSidenav;
    });

    this.authService.sixUser$.subscribe((userProfile: User) => {
      if (userProfile) {
        this.userProfile = userProfile;
      }
    });

    this.searchService.suggestionResults$.subscribe(options => {
      this.options = options;
    });

    this.notificationsService.notificationCount$.subscribe((count: number) => {
      this.notificationsCount = count;
    });

    this.notificationsService.restartPoolingNotifications();
  }

  logout(){
    this.authService.logout();
  }

  changeAcl(acl: Acl): void {
    this.authService.changeActiveAcl(acl);
  }

  selectOption(option: string): void {
    this.searchTerm = option;
    this.search();
  }

  searchInputChanged(input): void {
    this.searchTerm = input.target.value;
    this.searchService.searchSuggestions(this.searchTerm);
  }

  searchInputBlur(): void {
    this.focused = false;
    setTimeout(() => {
      this.showAutoComplete = false;
      this.options = [];
    }, 150);
  }

  searchInputFocus(): void {
    this.focused = true;
    this.options = [];
    this.showAutoComplete = true;

    if (this.searchTerm) {
      this.searchService.searchSuggestions(this.searchTerm);
    }
  }

  onSearchKey(event): void {
    this.showAutoComplete = true;

    if (event.key === 'Enter' && this.searchTerm && this.searchTerm.length > 0) {

      if (this.autocomplete && this.autocomplete.getSelected()) {
        this.searchTerm = this.autocomplete.getSelected();
      }

      this.search();
    }

    if (event.key === 'Tab' && this.autocomplete) {
      event.preventDefault();
    }
  }

  search(): void {
    this.router.navigate(['/search'], {queryParams: {query: this.searchTerm}});
    this.showAutoComplete = false;
  };

  toggleSidenav(): void {
    this.navigation.toggleSidenav(!this.showSidenav);
  }

  toggleCollapseMenu(): void {
    this.showCollapseMenu = !this.showCollapseMenu;
  }

  navigateToProfile(): void {
    this.router.navigateByUrl('/profile');
  }

  showNotifications(): void {
    this.navigation.toggleNotifications(true);
  }

  hideElements(event): void {
    if (!event.target.attributes.class || event.target.attributes.class.value !== 'topnav__items--collapsed__icon material-icons') {
      this.showCollapseMenu = false;
    }
  }
}
