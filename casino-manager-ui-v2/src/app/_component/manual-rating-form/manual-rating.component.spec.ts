import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualRatingComponent } from './manual-rating.component';

describe('ManualRatingComponent', () => {
  let component: ManualRatingComponent;
  let fixture: ComponentFixture<ManualRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
