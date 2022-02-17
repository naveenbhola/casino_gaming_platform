import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RollTimeComponent } from './roll-time.component';

describe('RollTimeComponent', () => {
  let component: RollTimeComponent;
  let fixture: ComponentFixture<RollTimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RollTimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RollTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
