import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintWindowErrorComponent } from './print-window-error.component';

describe('PrintWindowComponent', () => {
  let component: PrintWindowErrorComponent;
  let fixture: ComponentFixture<PrintWindowErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintWindowErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintWindowErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
