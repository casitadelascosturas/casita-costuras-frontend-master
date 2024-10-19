import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesFormMainComponent } from './services-form-main.component';

describe('ServicesFormMainComponent', () => {
  let component: ServicesFormMainComponent;
  let fixture: ComponentFixture<ServicesFormMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesFormMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesFormMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
