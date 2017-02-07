/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SmtpProviderViewComponent } from './smtp-provider-view.component';

describe('SmtpProviderViewComponent', () => {
  let component: SmtpProviderViewComponent;
  let fixture: ComponentFixture<SmtpProviderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmtpProviderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtpProviderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
