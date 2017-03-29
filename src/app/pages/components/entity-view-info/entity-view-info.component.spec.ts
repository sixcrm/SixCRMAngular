import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityViewInfoComponent } from './entity-view-info.component';

describe('EntityViewInfoComponent', () => {
  let component: EntityViewInfoComponent;
  let fixture: ComponentFixture<EntityViewInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityViewInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityViewInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
