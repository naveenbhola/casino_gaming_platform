import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySearchResultComponent } from './display-search-result.component';

describe('DisplaySearchResultComponent', () => {
  let component: DisplaySearchResultComponent;
  let fixture: ComponentFixture<DisplaySearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaySearchResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaySearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
