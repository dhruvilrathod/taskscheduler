import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutineComponent } from './routine.component';

describe('RoutineComponent', () => {
  let component: RoutineComponent;
  let fixture: ComponentFixture<RoutineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
