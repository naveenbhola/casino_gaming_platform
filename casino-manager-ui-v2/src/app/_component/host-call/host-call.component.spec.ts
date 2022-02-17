import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostCallComponent } from './host-call.component';
import {MaterialComponentModule} from '../material-component/material-component.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonTranslationModule} from '../common-translation/common-translation.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AppRollTimeModule} from '../roll-time/app-roll-time.module';

describe('HostCallComponent', () => {
  let component: HostCallComponent;
  let fixture: ComponentFixture<HostCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostCallComponent ],
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
    fixture = TestBed.createComponent(HostCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
