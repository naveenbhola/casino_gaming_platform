import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenerCloserDetailsComponent } from './opener-closer-details.component';

describe('OpenerCloserDetailsComponent', () => {
  let component: OpenerCloserDetailsComponent;
  let fixture: ComponentFixture<OpenerCloserDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenerCloserDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenerCloserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
