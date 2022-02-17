import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerGridViewComponent } from './player-grid-view.component';

describe('PlayerGridViewComponent', () => {
  let component: PlayerGridViewComponent;
  let fixture: ComponentFixture<PlayerGridViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayerGridViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
