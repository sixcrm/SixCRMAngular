import {AuthPage} from '../po/auth.po';

export function doLogin(authPage: AuthPage, email: string, password: string) {
  authPage.getEmailInput().sendKeys(email);
  authPage.getPasswordInput().sendKeys(password);
  authPage.getLoginButton().click();
}

export function doRegister(authPage: AuthPage, email: string, password: string) {
  doLogin(authPage, email, password);
}
