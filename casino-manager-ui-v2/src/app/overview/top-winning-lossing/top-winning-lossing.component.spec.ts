import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopWinningLossingComponent } from './top-winning-lossing.component';

describe('TopWinningLossingComponent', () => {
  let component: TopWinningLossingComponent;
  let fixture: ComponentFixture<TopWinningLossingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopWinningLossingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopWinningLossingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
