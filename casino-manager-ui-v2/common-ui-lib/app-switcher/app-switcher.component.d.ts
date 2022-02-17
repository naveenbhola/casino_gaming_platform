import { OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilityService } from '../services/utility.service';
import * as ɵngcc0 from '@angular/core';
export declare class AppSwitcherComponent implements OnInit {
    private snackBar;
    dialog: MatDialog;
    utilService: UtilityService;
    isLoginApp: boolean;
    isPPMaster: boolean;
    currentAppCode: any;
    constructor(snackBar: MatSnackBar, dialog: MatDialog, utilService: UtilityService);
    ngOnInit(): void;
    openAppMenu(): void;
    closeAppMenu(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<AppSwitcherComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<AppSwitcherComponent, "app-switcher", never, { "currentAppCode": "currentAppCode"; }, {}, never, never>;
}

//# sourceMappingURL=app-switcher.component.d.ts.map