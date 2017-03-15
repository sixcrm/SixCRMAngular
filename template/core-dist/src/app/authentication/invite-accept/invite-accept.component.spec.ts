import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteAcceptComponent } from './invite-accept.component';

describe('InviteAcceptComponent', () => {
  let component: InviteAcceptComponent;
  let fixture: ComponentFixture<InviteAcceptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteAcceptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteAcceptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
