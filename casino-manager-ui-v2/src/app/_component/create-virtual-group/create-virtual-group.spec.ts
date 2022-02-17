import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVirtualComponentComponent } from './create-virtual-group';
import {MaterialComponentModule} from '../material-component/material-component.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonTranslationModule} from '../common-translation/common-translation.module';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AppRollTimeModule} from '../roll-time/app-roll-time.module';

describe('CreateVirtualComponentComponent', () => {
  let component: CreateVirtualComponentComponent;
  let fixture: ComponentFixture<CreateVirtualComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVirtualComponentComponent ],
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
    fixture = TestBed.createComponent(CreateVirtualComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
