import { Pipe } from '@angular/core';
export class WdtsSpecialCharPipe {
    // SPECIAL CHAR allowed alphanumeric characters with hyphen, underscore, space, ampersand and dot (- , _ , . , &)
    transform(value, args) {
        const SPLCHARSREJX = new RegExp('[^A-Za-z0-9-_. ]', 'gi');
        return value.replace(SPLCHARSREJX, '');
    }
}
WdtsSpecialCharPipe.decorators = [
    { type: Pipe, args: [{
                name: 'wdtsSpecialChar'
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2R0cy1zcGVjaWFsLWNoYXIucGlwZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1vbi11aS12Mi9zcmMvYXBwL3BpcGVzL3dkdHMtc3BlY2lhbC1jaGFyLnBpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLElBQUksRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFLcEQsTUFBTSxPQUFPLG1CQUFtQjtJQUNoQyxpSEFBaUg7SUFDL0csU0FBUyxDQUFDLEtBQWEsRUFBRSxJQUFVO1FBQy9CLE1BQU0sWUFBWSxHQUFHLElBQUksTUFBTSxDQUFDLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFELE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDM0MsQ0FBQzs7O1lBUkYsSUFBSSxTQUFDO2dCQUNKLElBQUksRUFBRSxpQkFBaUI7YUFDeEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXBlLCBQaXBlVHJhbnNmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBQaXBlKHtcbiAgbmFtZTogJ3dkdHNTcGVjaWFsQ2hhcidcbn0pXG5leHBvcnQgY2xhc3MgV2R0c1NwZWNpYWxDaGFyUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuLy8gU1BFQ0lBTCBDSEFSIGFsbG93ZWQgYWxwaGFudW1lcmljIGNoYXJhY3RlcnMgd2l0aCBoeXBoZW4sIHVuZGVyc2NvcmUsIHNwYWNlLCBhbXBlcnNhbmQgYW5kIGRvdCAoLSAsIF8gLCAuICwgJilcbiAgdHJhbnNmb3JtKHZhbHVlOiBzdHJpbmcsIGFyZ3M/OiBhbnkpOiBhbnkge1xuICAgICAgY29uc3QgU1BMQ0hBUlNSRUpYID0gbmV3IFJlZ0V4cCgnW15BLVphLXowLTktXy4gXScsICdnaScpO1xuICAgICAgcmV0dXJuIHZhbHVlLnJlcGxhY2UoU1BMQ0hBUlNSRUpYLCAnJyk7XG4gIH1cblxufVxuIl19