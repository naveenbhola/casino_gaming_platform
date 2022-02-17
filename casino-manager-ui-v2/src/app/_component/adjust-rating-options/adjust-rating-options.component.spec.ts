import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjustRatingOptionsComponent } from './adjust-rating-options.component';

describe('AdjustRatingOptionsComponent', () => {
  let component: AdjustRatingOptionsComponent;
  let fixture: ComponentFixture<AdjustRatingOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdjustRatingOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjustRatingOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
