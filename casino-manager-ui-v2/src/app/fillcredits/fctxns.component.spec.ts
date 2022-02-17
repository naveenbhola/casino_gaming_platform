import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FctxnsComponent } from './Fctxns.component';

describe('FctxnsComponent', () => {
  let component: FctxnsComponent;
  let fixture: ComponentFixture<FctxnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FctxnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FctxnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
