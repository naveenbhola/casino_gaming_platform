import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenercloserComponent } from './Openercloser.component';

describe('OpenercloserComponent', () => {
  let component: OpenercloserComponent;
  let fixture: ComponentFixture<OpenercloserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenercloserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenercloserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
