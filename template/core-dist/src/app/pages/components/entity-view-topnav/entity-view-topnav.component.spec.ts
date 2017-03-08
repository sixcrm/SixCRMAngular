import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityViewTopnavComponent } from './entity-view-topnav.component';

describe('EntityViewTopnavComponent', () => {
  let component: EntityViewTopnavComponent;
  let fixture: ComponentFixture<EntityViewTopnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityViewTopnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityViewTopnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
