import { AppPage } from './app.po';

describe('App load', function() {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should load Auth component', () => {
    page.navigateTo();

    expect(page.getAuthComponent().isPresent()).toBeTruthy();
  });

  it('should load Auth0 Lock', () => {
    page.navigateTo();

    expect(page.getAuth0Lock().isPresent()).toBeTruthy();
  });
});
