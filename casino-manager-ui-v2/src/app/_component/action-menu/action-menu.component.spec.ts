import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionMenuComponent } from './action-menu.component';
import {MaterialComponentModule} from '../material-component/material-component.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonTranslationModule} from '../common-translation/common-translation.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AppRollTimeModule} from '../roll-time/app-roll-time.module';

describe('ActionMenuComponent', () => {
  let component: ActionMenuComponent;
  let fixture: ComponentFixture<ActionMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionMenuComponent ],
        imports: [
            MaterialComponentModule,
            BrowserAnimationsModule,
            CommonTranslationModule,
            HttpClientTestingModule,
            AppRollTimeModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
