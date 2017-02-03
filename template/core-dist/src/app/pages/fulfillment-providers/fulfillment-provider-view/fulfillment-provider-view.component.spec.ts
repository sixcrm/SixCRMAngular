/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FulfillmentProviderViewComponent } from './fulfillment-provider-view.component';

describe('FulfillmentProviderViewComponent', () => {
  let component: FulfillmentProviderViewComponent;
  let fixture: ComponentFixture<FulfillmentProviderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FulfillmentProviderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FulfillmentProviderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
