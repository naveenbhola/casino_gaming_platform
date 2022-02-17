import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BuyInTransactionInterface } from '../interface/cage.interface';
import * as ɵngcc0 from '@angular/core';
export declare class TransactionsService {
    private http;
    gamingDay: string;
    constructor(http: HttpClient);
    getBuyInData(): Observable<BuyInTransactionInterface[]>;
    getCreditData(): Observable<HttpResponse<Object>>;
    getFillData(): Observable<HttpResponse<Object>>;
    getChipTrayScanData(): Observable<HttpResponse<Object>>;
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TransactionsService, never>;
}

//# sourceMappingURL=transactions.service.d.ts.map