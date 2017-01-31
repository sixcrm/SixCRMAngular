import {MenuItem} from './menu-item';
import {NavigationService} from './navigation.service';
import {SidenavItemComponent} from './sidenav/sidenav-item/sidenav-item.component';
import {SampleMenuDialogComponent} from '../examples/dialog/sample-menu-dialog/sample-menu-dialog.component';

export const menuItemSetup: MenuItem[] = [
  new MenuItem('Dashboard', '/examples/dashboard'),
  new MenuItem('Components', null, [
    // new MenuItem('Badges', '/examples/badges'),
    new MenuItem('Buttons', '/examples/buttons'),
    new MenuItem('Breadcrumbs', '/examples/breadcrumbs', [], {breadcrumbs : 'visible'}),
    new MenuItem('Cards', '/examples/cards'),
    new MenuItem('Checkboxes', '/examples/checkboxes'),
    // new MenuItem('Chips', '/examples/chips'), // Removed Until @angular/material releases their own version
    new MenuItem('Dialogs', '/examples/dialog'),
    new MenuItem('Icons', '/examples/icons'),
    new MenuItem('Lists', '/examples/lists'),
    new MenuItem('Notifications', '/examples/notifications'),
    // new MenuItem('Pagination', '/examples/pagination'),
    new MenuItem('Progress', '/examples/progress'),
    new MenuItem('Tabs', '/examples/tabs'),
    new MenuItem('Toolbar', '/examples/toolbar'),
  ]),
  new MenuItem('Forms', null, [
    new MenuItem('Basic Forms', '/examples/forms'),
    new MenuItem('Wizard', '/examples/wizard'),
  ]),
  new MenuItem('Tables', null, [
    new MenuItem('Basic Tables', '/examples/tables'),
    new MenuItem('Data Tables', '/examples/data-tables')
  ]),
  new MenuItem('Charts', null, [
    // new MenuItem('Google Charts', null, [
    //   new MenuItem('Bar', '/examples/google-maps'),
    //   new MenuItem('Pie', '/examples/google-maps')
    // ]),
    new MenuItem('Google Charts', '/examples/google-charts'),
    // new MenuItem('HighCharts', null, [
    //   new MenuItem('Bar', '/examples/google-maps'),
    //   new MenuItem('Pie', '/examples/google-maps')
    // ])
  ]),
  new MenuItem('Maps', null, [
    new MenuItem('Google Maps', '/examples/google-maps')
  ]),
  // new MenuItem('Pages', null, [
  //   new MenuItem('Login', '/auth/auth'),
  //   new MenuItem('Register', '/auth/register'),
  // ]),
  new MenuItem('Menu', null, [
    new MenuItem('Dynamic Menu', '/examples/dynamic'),
    new MenuItem('Click Handler', null, [], null, (event: MouseEvent, navigation: NavigationService, menuItem: SidenavItemComponent) => {
      navigation.dialog.open(SampleMenuDialogComponent);
    }),
    new MenuItem('Levels', null, [
      new MenuItem('Level 1', '/examples/levels/1'),
      new MenuItem('Level 1', null, [
        new MenuItem('Level 2', '/examples/levels/2')
      ]),
      new MenuItem('Level 1', null, [
        new MenuItem('Level 2', null, [
          new MenuItem('Level 3', '/examples/levels/3'),
        ])
      ]),
      new MenuItem('Level 1', null, [
        new MenuItem('Level 2', null, [
          new MenuItem('Level 3', null, [
            new MenuItem('Level 4', '/examples/levels/4')
          ])
        ])
      ]),
    ]),
  ]),
  new MenuItem('Purchase Theme', null, [], null, (event) => {
    window.location.href = 'https://themeforest.net/item/coreng-angular-2-material-design-admin-template/18691824';
  })
];
