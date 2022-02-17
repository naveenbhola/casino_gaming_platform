import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparescansComponent } from './comparescans.component';

describe('ComparescansComponent', () => {
  let component: ComparescansComponent;
  let fixture: ComponentFixture<ComparescansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparescansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparescansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
