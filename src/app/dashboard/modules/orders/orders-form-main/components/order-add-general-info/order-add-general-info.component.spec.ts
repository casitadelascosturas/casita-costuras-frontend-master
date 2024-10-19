import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAddGeneralInfoComponent } from './order-add-general-info.component';

describe('OrderAddGeneralInfoComponent', () => {
  let component: OrderAddGeneralInfoComponent;
  let fixture: ComponentFixture<OrderAddGeneralInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderAddGeneralInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderAddGeneralInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
