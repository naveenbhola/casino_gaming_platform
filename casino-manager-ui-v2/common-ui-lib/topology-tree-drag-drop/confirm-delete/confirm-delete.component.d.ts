import { OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import * as ɵngcc0 from '@angular/core';
export declare class ConfirmDeleteComponent implements OnInit {
    dialogRef: MatDialog;
    data: any;
    translate: TranslateService;
    nodeToDelete: any;
    constructor(dialogRef: MatDialog, data: any, translate: TranslateService);
    ngOnInit(): void;
    closeDialogBox(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ConfirmDeleteComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<ConfirmDeleteComponent, "app-confirm-delete", never, {}, {}, never, never>;
}

//# sourceMappingURL=confirm-delete.component.d.ts.map