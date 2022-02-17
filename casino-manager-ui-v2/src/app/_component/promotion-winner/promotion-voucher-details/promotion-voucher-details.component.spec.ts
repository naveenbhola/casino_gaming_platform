import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintWindowWinnerComponent } from './promotion-voucher-details.component';

describe('PrintWindowComponent', () => {
  let component: PrintWindowWinnerComponent;
  let fixture: ComponentFixture<PrintWindowWinnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintWindowWinnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintWindowWinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
