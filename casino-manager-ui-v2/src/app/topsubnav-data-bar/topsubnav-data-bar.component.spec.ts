import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubnavDataBarComponent } from './topsubnav-data-bar.component';
import {MaterialComponentModule} from '../../material-component/material-component.module';

xdescribe('SubnavBarComponent', () => {
    let component: SubnavDataBarComponent;
    let fixture: ComponentFixture<SubnavDataBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ SubnavDataBarComponent ],
            imports: [MaterialComponentModule]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SubnavDataBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
