import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipSecurityComponent } from './chip-security.component';

describe('ChipSecurityComponent', () => {
  let component: ChipSecurityComponent;
  let fixture: ComponentFixture<ChipSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChipSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
