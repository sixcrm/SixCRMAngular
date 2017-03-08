import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmtpProviderComponent } from './smtp-provider.component';

describe('SmtpProviderComponent', () => {
  let component: SmtpProviderComponent;
  let fixture: ComponentFixture<SmtpProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmtpProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmtpProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
