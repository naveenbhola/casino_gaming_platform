import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export declare class TableDashboardService {
    private http;
    constructor(http: HttpClient);
    getPlayers(options: {}): Observable<HttpResponse<Object>>;
    getBetsUsingUuid(options: {}): Observable<HttpResponse<Object>>;
    getPlayerById(playerId: any, options: {}): Observable<HttpResponse<Object>>;
    getSessionDetailBySessionID(sessionId: any, options: {}): Observable<HttpResponse<Object>>;
    getSessionDetailSessionsByIds(sessionIdAry: any, options: {}): Observable<HttpResponse<Object>>;
    updatePlayer(reqObj: any, options: {}): Observable<HttpResponse<Object>>;
    updateIrcNumber(body: any): Observable<HttpResponse<Object>>;
    updateNotes(body: any): Observable<HttpResponse<Object>>;
    updateManualRating(body: any, sessionId: any): Observable<HttpResponse<Object>>;
    createManualRating(body: any): Observable<HttpResponse<Object>>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TableDashboardService, never>;
}

//# sourceMappingURL=table-dashboard.service.d.ts.map