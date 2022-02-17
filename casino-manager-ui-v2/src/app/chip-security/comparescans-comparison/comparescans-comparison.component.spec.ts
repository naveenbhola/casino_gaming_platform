import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparescansComparisonComponent } from './comparescans-comparison.component';

describe('ComparescansComparisonComponent', () => {
  let component: ComparescansComparisonComponent;
  let fixture: ComponentFixture<ComparescansComparisonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparescansComparisonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparescansComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
