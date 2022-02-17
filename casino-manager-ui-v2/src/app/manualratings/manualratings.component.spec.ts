import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualratingsComponent } from './Manualratings.component';

describe('ManualratingsComponent', () => {
  let component: ManualratingsComponent;
  let fixture: ComponentFixture<ManualratingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualratingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualratingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
