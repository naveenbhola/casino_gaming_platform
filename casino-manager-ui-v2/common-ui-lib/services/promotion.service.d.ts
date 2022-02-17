import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export declare class PromotionService {
    private http;
    constructor(http: HttpClient);
    getPromotions(options: {}): Observable<HttpResponse<Object>>;
    changeStatus(promotionId: any, options: {}): Observable<HttpResponse<Object>>;
    createPromotion(body: {}, options?: {}): Observable<HttpResponse<Object>>;
    managePromotionEnabled(): Observable<HttpResponse<Object>>;
    getWinners(options: {}): Observable<HttpResponse<Object>>;
    getEligibleDays(options: {}): Observable<HttpResponse<Object>>;
    /**
       * this function get the comp api data and path is end point of api like Properties,CompType etc..
       * @param path
       * @param options
    */
    getCompApi(path: any, options: {}): Observable<HttpResponse<Object>>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<PromotionService, never>;
}

//# sourceMappingURL=promotion.service.d.ts.map