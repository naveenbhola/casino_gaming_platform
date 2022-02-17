import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urls } from '../constants/urls';
import { of } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class TransactionsService {
    constructor(http) {
        this.http = http;
        this.gamingDay = '';
    }
    getBuyInData() {
        const url = `${urls.cage.buyInTransaction + '?gamingDay=' + urls.cage.gamingDay + '&txnTypes=BUYIN&topologyIds=1009&start=1&limit=1000'}`;
        //console.log('localgamingdays:::', url);
        return this.http.get(url);
    }
    getCreditData() {
        const url = `${urls.cage.buyInTransaction + '?gamingDay=' + urls.cage.gamingDay + '&txnTypes=CREDIT&topologyIds=1009&start=1&limit=1000'}`;
        return this.http.get(url);
    }
    getFillData() {
        const url = `${urls.cage.buyInTransaction + '?gamingDay=' + urls.cage.gamingDay + '&txnTypes=FILL&topologyIds=1009&start=1&limit=1000'}`;
        return this.http.get(url);
    }
    getChipTrayScanData() {
        const url = `${urls.cage.chipTrayScan + '1001' + '?gamingDay=' + urls.cage.gamingDay + '&reqFilter=1'}`;
        return this.http.get(url);
    }
    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    handleError(operation = 'operation', result) {
        return (error) => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead
            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);
            // Let the app keep running by returning an empty result.
            return of(result);
        };
    }
}
TransactionsService.ɵprov = i0.ɵɵdefineInjectable({ factory: function TransactionsService_Factory() { return new TransactionsService(i0.ɵɵinject(i1.HttpClient)); }, token: TransactionsService, providedIn: "root" });
TransactionsService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
TransactionsService.ctorParameters = () => [
    { type: HttpClient }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNhY3Rpb25zLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tb24tdWktdjIvc3JjL2FwcC9zZXJ2aWNlcy90cmFuc2FjdGlvbnMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxVQUFVLEVBQWUsTUFBTSxzQkFBc0IsQ0FBQztBQUM5RCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDdkMsT0FBTyxFQUFhLEVBQUUsRUFBQyxNQUFNLE1BQU0sQ0FBQzs7O0FBUXBDLE1BQU0sT0FBTyxtQkFBbUI7SUFFOUIsWUFBb0IsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQURsQyxjQUFTLEdBQUcsRUFBRSxDQUFBO0lBQ3dCLENBQUM7SUFFekMsWUFBWTtRQUVWLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxhQUFhLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcscURBQXFELEVBQUUsQ0FBQztRQUN4SSx5Q0FBeUM7UUFDM0MsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBOEIsR0FBRyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUNDLGFBQWE7UUFDVCxNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLHNEQUFzRCxFQUFFLENBQUM7UUFDM0ksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBdUIsR0FBRyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUNELFdBQVc7UUFDUCxNQUFNLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLG9EQUFvRCxFQUFFLENBQUM7UUFDekksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBdUIsR0FBRyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUNELG1CQUFtQjtRQUNYLE1BQU0sR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxHQUFHLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxjQUFjLEVBQUUsQ0FBQztRQUN4RyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUF1QixHQUFHLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUw7Ozs7O09BS0c7SUFDSyxXQUFXLENBQUssU0FBUyxHQUFHLFdBQVcsRUFBRSxNQUFVO1FBQ3ZELE9BQU8sQ0FBQyxLQUFVLEVBQWlCLEVBQUU7WUFFakMsd0RBQXdEO1lBQ3hELE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyx5QkFBeUI7WUFFL0MsOERBQThEO1lBQzlELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxTQUFTLFlBQVksS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFFckQseURBQXlEO1lBQ3pELE9BQU8sRUFBRSxDQUFDLE1BQVcsQ0FBQyxDQUFDO1FBQzNCLENBQUMsQ0FBQztJQUNOLENBQUM7Ozs7WUE1Q0osVUFBVSxTQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COzs7WUFUTyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwUmVzcG9uc2V9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7dXJsc30gZnJvbSAnLi4vY29uc3RhbnRzL3VybHMnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBvZn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge0J1eUluVHJhbnNhY3Rpb25JbnRlcmZhY2V9IGZyb20gJy4uL2ludGVyZmFjZS9jYWdlLmludGVyZmFjZSc7XG5cblxuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBUcmFuc2FjdGlvbnNTZXJ2aWNlIHtcbiAgICBnYW1pbmdEYXkgPSAnJ1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHsgfVxuXG4gIGdldEJ1eUluRGF0YSgpOiBPYnNlcnZhYmxlPEJ1eUluVHJhbnNhY3Rpb25JbnRlcmZhY2VbXT4ge1xuXG4gICAgY29uc3QgdXJsID0gYCR7dXJscy5jYWdlLmJ1eUluVHJhbnNhY3Rpb24gKyAnP2dhbWluZ0RheT0nICsgdXJscy5jYWdlLmdhbWluZ0RheSArICcmdHhuVHlwZXM9QlVZSU4mdG9wb2xvZ3lJZHM9MTAwOSZzdGFydD0xJmxpbWl0PTEwMDAnfWA7XG4gICAgICAvL2NvbnNvbGUubG9nKCdsb2NhbGdhbWluZ2RheXM6OjonLCB1cmwpO1xuICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PEJ1eUluVHJhbnNhY3Rpb25JbnRlcmZhY2VbXT4odXJsKTtcbiAgfVxuICAgIGdldENyZWRpdERhdGEoKTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8T2JqZWN0Pj4ge1xuICAgICAgICBjb25zdCB1cmwgPSBgJHt1cmxzLmNhZ2UuYnV5SW5UcmFuc2FjdGlvbiArICc/Z2FtaW5nRGF5PScgKyB1cmxzLmNhZ2UuZ2FtaW5nRGF5ICsgJyZ0eG5UeXBlcz1DUkVESVQmdG9wb2xvZ3lJZHM9MTAwOSZzdGFydD0xJmxpbWl0PTEwMDAnfWA7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PEh0dHBSZXNwb25zZTxPYmplY3Q+Pih1cmwpO1xuICAgIH1cbiAgICBnZXRGaWxsRGF0YSgpOiBPYnNlcnZhYmxlPEh0dHBSZXNwb25zZTxPYmplY3Q+PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IGAke3VybHMuY2FnZS5idXlJblRyYW5zYWN0aW9uICsgJz9nYW1pbmdEYXk9JyArIHVybHMuY2FnZS5nYW1pbmdEYXkgKyAnJnR4blR5cGVzPUZJTEwmdG9wb2xvZ3lJZHM9MTAwOSZzdGFydD0xJmxpbWl0PTEwMDAnfWA7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PEh0dHBSZXNwb25zZTxPYmplY3Q+Pih1cmwpO1xuICAgIH1cbiAgICBnZXRDaGlwVHJheVNjYW5EYXRhKCk6IE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPE9iamVjdD4+IHtcbiAgICAgICAgICAgIGNvbnN0IHVybCA9IGAke3VybHMuY2FnZS5jaGlwVHJheVNjYW4gKyAnMTAwMScgKyAnP2dhbWluZ0RheT0nICsgdXJscy5jYWdlLmdhbWluZ0RheSArICcmcmVxRmlsdGVyPTEnfWA7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldDxIdHRwUmVzcG9uc2U8T2JqZWN0Pj4odXJsKTtcbiAgICAgICAgfVxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIEh0dHAgb3BlcmF0aW9uIHRoYXQgZmFpbGVkLlxuICAgICAqIExldCB0aGUgYXBwIGNvbnRpbnVlLlxuICAgICAqIEBwYXJhbSBvcGVyYXRpb24gLSBuYW1lIG9mIHRoZSBvcGVyYXRpb24gdGhhdCBmYWlsZWRcbiAgICAgKiBAcGFyYW0gcmVzdWx0IC0gb3B0aW9uYWwgdmFsdWUgdG8gcmV0dXJuIGFzIHRoZSBvYnNlcnZhYmxlIHJlc3VsdFxuICAgICAqL1xuICAgIHByaXZhdGUgaGFuZGxlRXJyb3I8VD4gKG9wZXJhdGlvbiA9ICdvcGVyYXRpb24nLCByZXN1bHQ/OiBUKSB7XG4gICAgICAgIHJldHVybiAoZXJyb3I6IGFueSk6IE9ic2VydmFibGU8VD4gPT4ge1xuXG4gICAgICAgICAgICAvLyBUT0RPOiBzZW5kIHRoZSBlcnJvciB0byByZW1vdGUgbG9nZ2luZyBpbmZyYXN0cnVjdHVyZVxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7IC8vIGxvZyB0byBjb25zb2xlIGluc3RlYWRcblxuICAgICAgICAgICAgLy8gVE9ETzogYmV0dGVyIGpvYiBvZiB0cmFuc2Zvcm1pbmcgZXJyb3IgZm9yIHVzZXIgY29uc3VtcHRpb25cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke29wZXJhdGlvbn0gZmFpbGVkOiAke2Vycm9yLm1lc3NhZ2V9YCk7XG5cbiAgICAgICAgICAgIC8vIExldCB0aGUgYXBwIGtlZXAgcnVubmluZyBieSByZXR1cm5pbmcgYW4gZW1wdHkgcmVzdWx0LlxuICAgICAgICAgICAgcmV0dXJuIG9mKHJlc3VsdCBhcyBUKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbn1cbiJdfQ==