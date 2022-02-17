import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urls } from '../constants/urls';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class PromotionService {
    constructor(http) {
        this.http = http;
    }
    getPromotions(options) {
        const url = `${urls.promotion.promotionPath}`;
        return this.http.get(url, options);
    }
    changeStatus(promotionId, options) {
        const url = `${urls.promotion.promotionUpdatePath}${promotionId}`;
        return this.http.put(url, options);
    }
    createPromotion(body, options) {
        const url = `${urls.promotion.promotionPath}`;
        return this.http.post(url, body, options);
    }
    managePromotionEnabled() {
        const url = `${urls.promotion.managePromotionEnabled}`;
        return this.http.get(url);
    }
    getWinners(options) {
        const url = `${urls.promotion.winners}`;
        return this.http.get(url, options);
    }
    getEligibleDays(options) {
        const url = `${urls.promotion.promotionsEligibleDays}`;
        return this.http.get(url, options);
    }
    /**
       * this function get the comp api data and path is end point of api like Properties,CompType etc..
       * @param path
       * @param options
    */
    getCompApi(path, options) {
        const url = `${urls.promotion.promotionsCompApi}${path}`;
        return this.http.get(url, options);
    }
}
PromotionService.ɵprov = i0.ɵɵdefineInjectable({ factory: function PromotionService_Factory() { return new PromotionService(i0.ɵɵinject(i1.HttpClient)); }, token: PromotionService, providedIn: "root" });
PromotionService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
PromotionService.ctorParameters = () => [
    { type: HttpClient }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbW90aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tb24tdWktdjIvc3JjL2FwcC9zZXJ2aWNlcy9wcm9tb3Rpb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxVQUFVLEVBQWUsTUFBTSxzQkFBc0IsQ0FBQztBQUU5RCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7OztBQUt2QyxNQUFNLE9BQU8sZ0JBQWdCO0lBRTNCLFlBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7SUFBSSxDQUFDO0lBRXpDLGFBQWEsQ0FBQyxPQUFXO1FBQ3ZCLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUM5QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUF1QixHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELFlBQVksQ0FBQyxXQUFXLEVBQUUsT0FBVztRQUNuQyxNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEdBQUcsV0FBVyxFQUFFLENBQUM7UUFDbEUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBdUIsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxlQUFlLENBQUMsSUFBUSxFQUFFLE9BQVk7UUFDcEMsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzlDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQXVCLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVELHNCQUFzQjtRQUNwQixNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUN2RCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUF1QixHQUFHLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsVUFBVSxDQUFDLE9BQVc7UUFDcEIsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3hDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQXVCLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBQ0QsZUFBZSxDQUFDLE9BQVc7UUFDdkIsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDdkQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBdUIsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRDs7OztNQUlFO0lBQ0YsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFXO1FBQ3pCLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLEVBQUUsQ0FBQztRQUN6RCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUF1QixHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDNUQsQ0FBQzs7OztZQTVDRixVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7OztZQU5PLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0h0dHBDbGllbnQsIEh0dHBSZXNwb25zZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7dXJsc30gZnJvbSAnLi4vY29uc3RhbnRzL3VybHMnO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBQcm9tb3Rpb25TZXJ2aWNlIHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHsgfVxuXG4gIGdldFByb21vdGlvbnMob3B0aW9uczoge30pOiBPYnNlcnZhYmxlPEh0dHBSZXNwb25zZTxPYmplY3Q+PiB7XG4gICAgY29uc3QgdXJsID0gYCR7dXJscy5wcm9tb3Rpb24ucHJvbW90aW9uUGF0aH1gO1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PEh0dHBSZXNwb25zZTxPYmplY3Q+Pih1cmwsIG9wdGlvbnMpO1xuICB9XG5cbiAgY2hhbmdlU3RhdHVzKHByb21vdGlvbklkLCBvcHRpb25zOiB7fSk6IE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPE9iamVjdD4+IHtcbiAgICBjb25zdCB1cmwgPSBgJHt1cmxzLnByb21vdGlvbi5wcm9tb3Rpb25VcGRhdGVQYXRofSR7cHJvbW90aW9uSWR9YDtcbiAgICByZXR1cm4gdGhpcy5odHRwLnB1dDxIdHRwUmVzcG9uc2U8T2JqZWN0Pj4odXJsLCBvcHRpb25zKTtcbiAgfVxuXG4gIGNyZWF0ZVByb21vdGlvbihib2R5OiB7fSwgb3B0aW9ucz86IHt9KTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8T2JqZWN0Pj4ge1xuICAgIGNvbnN0IHVybCA9IGAke3VybHMucHJvbW90aW9uLnByb21vdGlvblBhdGh9YDtcbiAgICByZXR1cm4gdGhpcy5odHRwLnBvc3Q8SHR0cFJlc3BvbnNlPE9iamVjdD4+KHVybCwgYm9keSwgb3B0aW9ucyk7XG4gIH1cblxuICBtYW5hZ2VQcm9tb3Rpb25FbmFibGVkKCk6IE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPE9iamVjdD4+IHtcbiAgICBjb25zdCB1cmwgPSBgJHt1cmxzLnByb21vdGlvbi5tYW5hZ2VQcm9tb3Rpb25FbmFibGVkfWA7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8SHR0cFJlc3BvbnNlPE9iamVjdD4+KHVybCk7XG4gIH1cblxuICBnZXRXaW5uZXJzKG9wdGlvbnM6IHt9KTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8T2JqZWN0Pj4ge1xuICAgIGNvbnN0IHVybCA9IGAke3VybHMucHJvbW90aW9uLndpbm5lcnN9YDtcbiAgICByZXR1cm4gdGhpcy5odHRwLmdldDxIdHRwUmVzcG9uc2U8T2JqZWN0Pj4odXJsLCBvcHRpb25zKTtcbiAgfVxuICBnZXRFbGlnaWJsZURheXMob3B0aW9uczoge30pIHtcbiAgICAgIGNvbnN0IHVybCA9IGAke3VybHMucHJvbW90aW9uLnByb21vdGlvbnNFbGlnaWJsZURheXN9YDtcbiAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PEh0dHBSZXNwb25zZTxPYmplY3Q+Pih1cmwsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAgICogdGhpcyBmdW5jdGlvbiBnZXQgdGhlIGNvbXAgYXBpIGRhdGEgYW5kIHBhdGggaXMgZW5kIHBvaW50IG9mIGFwaSBsaWtlIFByb3BlcnRpZXMsQ29tcFR5cGUgZXRjLi5cbiAgICAgKiBAcGFyYW0gcGF0aFxuICAgICAqIEBwYXJhbSBvcHRpb25zXG4gICovXG4gIGdldENvbXBBcGkocGF0aCwgb3B0aW9uczoge30pIHtcbiAgICAgY29uc3QgdXJsID0gYCR7dXJscy5wcm9tb3Rpb24ucHJvbW90aW9uc0NvbXBBcGl9JHtwYXRofWA7XG4gICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PEh0dHBSZXNwb25zZTxPYmplY3Q+Pih1cmwsIG9wdGlvbnMpO1xuICB9XG59XG4iXX0=