import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantProviderComponent } from './merchant-provider.component';

describe('MerchantProviderComponent', () => {
  let component: MerchantProviderComponent;
  let fixture: ComponentFixture<MerchantProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MerchantProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
