import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityViewInfoArrayComponent } from './entity-view-info-array.component';

describe('EntityViewInfoArrayComponent', () => {
  let component: EntityViewInfoArrayComponent;
  let fixture: ComponentFixture<EntityViewInfoArrayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityViewInfoArrayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityViewInfoArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
