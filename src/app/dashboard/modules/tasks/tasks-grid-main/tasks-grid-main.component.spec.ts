import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksGridMainComponent } from './tasks-grid-main.component';

describe('TasksGridMainComponent', () => {
  let component: TasksGridMainComponent;
  let fixture: ComponentFixture<TasksGridMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksGridMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksGridMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
