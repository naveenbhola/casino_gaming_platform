import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionWinnerComponent } from './promotion-winner.component';

describe('PromotionWinnerComponent', () => {
  let component: PromotionWinnerComponent;
  let fixture: ComponentFixture<PromotionWinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionWinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionWinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
