import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FulfillmentProviderComponent } from './fulfillment-provider.component';

describe('FulfillmentProviderComponent', () => {
  let component: FulfillmentProviderComponent;
  let fixture: ComponentFixture<FulfillmentProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FulfillmentProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FulfillmentProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
