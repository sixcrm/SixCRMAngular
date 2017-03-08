import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductScheduleComponent } from './product-schedule.component';

describe('ProductSchedulesComponent', () => {
  let component: ProductScheduleComponent;
  let fixture: ComponentFixture<ProductScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
