import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewtaskComponent } from './addnewtask.component';

describe('AddnewtaskComponent', () => {
  let component: AddnewtaskComponent;
  let fixture: ComponentFixture<AddnewtaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddnewtaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewtaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
