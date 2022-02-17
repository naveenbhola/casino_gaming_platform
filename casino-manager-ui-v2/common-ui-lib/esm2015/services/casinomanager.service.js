import { Injectable } from '@angular/core';
import { urls } from '../constants/urls';
import { HttpClient } from '@angular/common/http';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class CasinomanagerService {
    constructor(http) {
        this.http = http;
    }
    getTopologyStatisticsTabularView(options) {
        const url = urls.casinoMgr.topologyStatisticsTabularView;
        return this.http.get(url, options);
    }
    getTopologyStatsTabularView(options) {
        const url = urls.casinoMgr.topologyStatsTabularView;
        return this.http.get(url, options);
    }
    getTopologyStatisticsGridView(options) {
        const url = urls.casinoMgr.topologyStatisticsGridView;
        return this.http.get(url, options);
    }
    getTopologyStatsByTableType(options, url) {
        const finalUrl = urls.casinoMgr.topologyStatsByTableType + url;
        return this.http.get(finalUrl, options);
    }
    getTopologyStatistics(gamingDay, topologyIds, viewId, options) {
        const url = `${urls.casinoMgr.topologyStatistics}?gamingDay=${gamingDay}&topologyIds=${topologyIds}&viewId=${viewId}`;
        return this.http.get(url, options);
    }
    getTopologyStatisticsForVirtualGroup(gamingDay, topologyGroupId, viewId, options) {
        const url = `${urls.casinoMgr.topologyStatisticsForVirtualGroup}?gamingDay=${gamingDay}&topologyGroupId=${topologyGroupId}&viewId=${viewId}`;
        return this.http.get(url, options);
    }
    getTopLosingCasino(gamingDay, topologyId) {
        const url = `${urls.casinoMgr.topLosingCasino}?gamingDay=${gamingDay}&topologyId=${topologyId}`;
        return this.http.get(url);
    }
    getTopWinningCasino(gamingDay, topologyId) {
        const url = `${urls.casinoMgr.topWinningCasino}?gamingDay=${gamingDay}&topologyId=${topologyId}`;
        return this.http.get(url);
    }
    getTopLosingPlayersVirtualGroup(gamingDay, topologyId) {
        const url = `${urls.casinoMgr.topLosingPlayersVirtualGroup}?gamingDay=${gamingDay}&topologyGroupId=${topologyId}`;
        return this.http.get(url);
    }
    getTopWinningPlayersVirtualGroup(gamingDay, topologyId) {
        const url = `${urls.casinoMgr.topWinningPlayersVirtualGroup}?gamingDay=${gamingDay}&topologyGroupId=${topologyId}`;
        return this.http.get(url);
    }
    getPlayerStatistics(options) {
        const url = urls.casinoMgr.playerStatistics;
        return this.http.get(url, options);
    }
    getPaginatedOpenerCloser(options) {
        const finalUrl = urls.cage.paginatedOpenerCloser;
        return this.http.get(finalUrl, options);
    }
    getPaginatedSearchManualRatings(url, options) {
        const finalUrl = urls.game.paginatedSearchManualRatings + url;
        return this.http.post(finalUrl, options);
    }
    getpaginatedSessions(payload, options) {
        const finalUrl = urls.game.paginatedSessions;
        return this.http.post(finalUrl, payload, options);
    }
    getpaginatedGames(options) {
        const finalUrl = urls.game.paginatedGames;
        return this.http.get(finalUrl, options);
    }
    getFilterForTable(options) {
        const url = urls.casinoMgr.tableFilter;
        return this.http.get(url, options);
    }
    getFilterForPlayer(options) {
        const url = urls.casinoMgr.playerFilter;
        return this.http.get(url, options);
    }
    getActivePlayer(options) {
        const url = urls.casinoMgr.activePlayer;
        return this.http.get(url, options);
    }
    getUserSearch(options) {
        const url = urls.casinoMgr.userSearch;
        return this.http.get(url, options);
    }
}
CasinomanagerService.ɵprov = i0.ɵɵdefineInjectable({ factory: function CasinomanagerService_Factory() { return new CasinomanagerService(i0.ɵɵinject(i1.HttpClient)); }, token: CasinomanagerService, providedIn: "root" });
CasinomanagerService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
CasinomanagerService.ctorParameters = () => [
    { type: HttpClient }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FzaW5vbWFuYWdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbW9uLXVpLXYyL3NyYy9hcHAvc2VydmljZXMvY2FzaW5vbWFuYWdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQ3ZDLE9BQU8sRUFBQyxVQUFVLEVBQWUsTUFBTSxzQkFBc0IsQ0FBQzs7O0FBTTlELE1BQU0sT0FBTyxvQkFBb0I7SUFFL0IsWUFBcUIsSUFBZ0I7UUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtJQUFJLENBQUM7SUFDeEMsZ0NBQWdDLENBQUMsT0FBVztRQUN4QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDO1FBQ3pELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQWdDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBQ0QsMkJBQTJCLENBQUMsT0FBVztRQUNuQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLHdCQUF3QixDQUFDO1FBQ3BELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQWdDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBQ0QsNkJBQTZCLENBQUMsT0FBVztRQUN2QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLDBCQUEwQixDQUFDO1FBQ3RELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQTZCLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBQ0QsMkJBQTJCLENBQUMsT0FBVyxFQUFFLEdBQUc7UUFDeEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FB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QVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7O1lBTE8sVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge1RvcG9sb2d5U3RhdGlzdGljc1RhYnVsYXJWaWV3LCBUb3BvbG9neVN0YXRpc3RpY3MsIFRvcG9sb2d5U3RhdGlzdGljc0dyaWRWaWV3fSBmcm9tICcuLi9pbnRlcmZhY2UvdG9wb2xvZ3ktdHlwZXMuaW50ZXJmYWNlJztcbmltcG9ydCB7dXJsc30gZnJvbSAnLi4vY29uc3RhbnRzL3VybHMnO1xuaW1wb3J0IHtIdHRwQ2xpZW50LCBIdHRwUmVzcG9uc2V9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7T3BlbmVyQ2xvc2VySW50ZXJmYWNlfSBmcm9tICcuLi9pbnRlcmZhY2UvY2FzaW5vLW1hbmFnZXIuaW50ZXJmYWNlJztcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQ2FzaW5vbWFuYWdlclNlcnZpY2Uge1xuXG4gIGNvbnN0cnVjdG9yKCBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHsgfVxuICAgIGdldFRvcG9sb2d5U3RhdGlzdGljc1RhYnVsYXJWaWV3KG9wdGlvbnM6IHt9KTogT2JzZXJ2YWJsZTxUb3BvbG9neVN0YXRpc3RpY3NUYWJ1bGFyVmlldz4ge1xuICAgICAgICBjb25zdCB1cmwgPSB1cmxzLmNhc2lub01nci50b3BvbG9neVN0YXRpc3RpY3NUYWJ1bGFyVmlldztcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8VG9wb2xvZ3lTdGF0aXN0aWNzVGFidWxhclZpZXc+KHVybCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGdldFRvcG9sb2d5U3RhdHNUYWJ1bGFyVmlldyhvcHRpb25zOiB7fSk6IE9ic2VydmFibGU8VG9wb2xvZ3lTdGF0aXN0aWNzVGFidWxhclZpZXc+IHtcbiAgICAgICAgY29uc3QgdXJsID0gdXJscy5jYXNpbm9NZ3IudG9wb2xvZ3lTdGF0c1RhYnVsYXJWaWV3O1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldDxUb3BvbG9neVN0YXRpc3RpY3NUYWJ1bGFyVmlldz4odXJsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgZ2V0VG9wb2xvZ3lTdGF0aXN0aWNzR3JpZFZpZXcob3B0aW9uczoge30pOiBPYnNlcnZhYmxlPFRvcG9sb2d5U3RhdGlzdGljc0dyaWRWaWV3PiB7XG4gICAgICBjb25zdCB1cmwgPSB1cmxzLmNhc2lub01nci50b3BvbG9neVN0YXRpc3RpY3NHcmlkVmlldztcbiAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PFRvcG9sb2d5U3RhdGlzdGljc0dyaWRWaWV3Pih1cmwsIG9wdGlvbnMpO1xuICAgIH1cbiAgICBnZXRUb3BvbG9neVN0YXRzQnlUYWJsZVR5cGUob3B0aW9uczoge30sIHVybCk6IE9ic2VydmFibGU8VG9wb2xvZ3lTdGF0aXN0aWNzVGFidWxhclZpZXc+IHtcbiAgICAgICAgY29uc3QgZmluYWxVcmwgPSB1cmxzLmNhc2lub01nci50b3BvbG9neVN0YXRzQnlUYWJsZVR5cGUgKyB1cmw7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PFRvcG9sb2d5U3RhdGlzdGljc1RhYnVsYXJWaWV3PihmaW5hbFVybCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGdldFRvcG9sb2d5U3RhdGlzdGljcyhnYW1pbmdEYXksIHRvcG9sb2d5SWRzLCB2aWV3SWQsIG9wdGlvbnM6IHt9KTogT2JzZXJ2YWJsZTxUb3BvbG9neVN0YXRpc3RpY3M+IHtcbiAgICAgIGNvbnN0IHVybCA9IGAke3VybHMuY2FzaW5vTWdyLnRvcG9sb2d5U3RhdGlzdGljc30/Z2FtaW5nRGF5PSR7Z2FtaW5nRGF5fSZ0b3BvbG9neUlkcz0ke3RvcG9sb2d5SWRzfSZ2aWV3SWQ9JHt2aWV3SWR9YDtcbiAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PFRvcG9sb2d5U3RhdGlzdGljcz4odXJsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgZ2V0VG9wb2xvZ3lTdGF0aXN0aWNzRm9yVmlydHVhbEdyb3VwKGdhbWluZ0RheSwgdG9wb2xvZ3lHcm91cElkLCB2aWV3SWQsIG9wdGlvbnM6IHt9KTogT2JzZXJ2YWJsZTxUb3BvbG9neVN0YXRpc3RpY3M+IHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7dXJscy5jYXNpbm9NZ3IudG9wb2xvZ3lTdGF0aXN0aWNzRm9yVmlydHVhbEdyb3VwfT9nYW1pbmdEYXk9JHtnYW1pbmdEYXl9JnRvcG9sb2d5R3JvdXBJZD0ke3RvcG9sb2d5R3JvdXBJZH0mdmlld0lkPSR7dmlld0lkfWA7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PFRvcG9sb2d5U3RhdGlzdGljcz4odXJsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgZ2V0VG9wTG9zaW5nQ2FzaW5vKGdhbWluZ0RheSwgdG9wb2xvZ3lJZCk6IE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPE9iamVjdD4+IHvigKhcbiAgICAgIGNvbnN0IHVybCA9IGAke3VybHMuY2FzaW5vTWdyLnRvcExvc2luZ0Nhc2lub30/Z2FtaW5nRGF5PSR7Z2FtaW5nRGF5fSZ0b3BvbG9neUlkPSR7dG9wb2xvZ3lJZH1gO+KAqFxuICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8SHR0cFJlc3BvbnNlPE9iamVjdD4+KHVybCk74oCoXG4gICAgfVxuICAgIOKAqGdldFRvcFdpbm5pbmdDYXNpbm8oZ2FtaW5nRGF5LCB0b3BvbG9neUlkKTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8T2JqZWN0Pj4ge+KAqFxuICAgICAgY29uc3QgdXJsID0gYCR7dXJscy5jYXNpbm9NZ3IudG9wV2lubmluZ0Nhc2lub30/Z2FtaW5nRGF5PSR7Z2FtaW5nRGF5fSZ0b3BvbG9neUlkPSR7dG9wb2xvZ3lJZH1gO+KAqFxuICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8SHR0cFJlc3BvbnNlPE9iamVjdD4+KHVybCk74oCoXG4gICAgfVxuICAgIGdldFRvcExvc2luZ1BsYXllcnNWaXJ0dWFsR3JvdXAoZ2FtaW5nRGF5LCB0b3BvbG9neUlkKTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8T2JqZWN0Pj4ge1xuICAgICAgICBjb25zdCB1cmwgPSBgJHt1cmxzLmNhc2lub01nci50b3BMb3NpbmdQbGF5ZXJzVmlydHVhbEdyb3VwfT9nYW1pbmdEYXk9JHtnYW1pbmdEYXl9JnRvcG9sb2d5R3JvdXBJZD0ke3RvcG9sb2d5SWR9YDtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8SHR0cFJlc3BvbnNlPE9iamVjdD4+KHVybCk7XG4gICAgfVxuICAgIGdldFRvcFdpbm5pbmdQbGF5ZXJzVmlydHVhbEdyb3VwKGdhbWluZ0RheSwgdG9wb2xvZ3lJZCk6IE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPE9iamVjdD4+IHtcbiAgICAgICAgY29uc3QgdXJsID0gYCR7dXJscy5jYXNpbm9NZ3IudG9wV2lubmluZ1BsYXllcnNWaXJ0dWFsR3JvdXB9P2dhbWluZ0RheT0ke2dhbWluZ0RheX0mdG9wb2xvZ3lHcm91cElkPSR7dG9wb2xvZ3lJZH1gO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLmdldDxIdHRwUmVzcG9uc2U8T2JqZWN0Pj4odXJsKTtcbiAgICB9XG4gICAgZ2V0UGxheWVyU3RhdGlzdGljcyhvcHRpb25zOiB7fSk6IE9ic2VydmFibGU8VG9wb2xvZ3lTdGF0aXN0aWNzVGFidWxhclZpZXc+IHtcbiAgICAgICAgY29uc3QgdXJsID0gdXJscy5jYXNpbm9NZ3IucGxheWVyU3RhdGlzdGljcztcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8VG9wb2xvZ3lTdGF0aXN0aWNzVGFidWxhclZpZXc+KHVybCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGdldFBhZ2luYXRlZE9wZW5lckNsb3NlcihvcHRpb25zOiB7fSk6IE9ic2VydmFibGU8T3BlbmVyQ2xvc2VySW50ZXJmYWNlPiB7XG4gICAgICAgIGNvbnN0IGZpbmFsVXJsID0gdXJscy5jYWdlLnBhZ2luYXRlZE9wZW5lckNsb3NlcjtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8T3BlbmVyQ2xvc2VySW50ZXJmYWNlPihmaW5hbFVybCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGdldFBhZ2luYXRlZFNlYXJjaE1hbnVhbFJhdGluZ3ModXJsLCBvcHRpb25zOiB7fSk6IE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPE9iamVjdD4+IHtcbiAgICAgICAgY29uc3QgZmluYWxVcmwgPSB1cmxzLmdhbWUucGFnaW5hdGVkU2VhcmNoTWFudWFsUmF0aW5ncyArIHVybDtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PEh0dHBSZXNwb25zZTxPYmplY3Q+PihmaW5hbFVybCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGdldHBhZ2luYXRlZFNlc3Npb25zKHBheWxvYWQgLCBvcHRpb25zOiB7fSk6IE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPE9iamVjdD4+IHtcbiAgICAgICAgY29uc3QgZmluYWxVcmwgPSB1cmxzLmdhbWUucGFnaW5hdGVkU2Vzc2lvbnM7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAucG9zdDxIdHRwUmVzcG9uc2U8T2JqZWN0Pj4oZmluYWxVcmwsIHBheWxvYWQsIG9wdGlvbnMpO1xuICAgIH1cbiAgICBnZXRwYWdpbmF0ZWRHYW1lcyhvcHRpb25zOiB7fSk6IE9ic2VydmFibGU8SHR0cFJlc3BvbnNlPE9iamVjdD4+IHtcbiAgICAgICAgY29uc3QgZmluYWxVcmwgPSB1cmxzLmdhbWUucGFnaW5hdGVkR2FtZXM7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PEh0dHBSZXNwb25zZTxPYmplY3Q+PihmaW5hbFVybCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGdldEZpbHRlckZvclRhYmxlKG9wdGlvbnM6IHt9KTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8T2JqZWN0Pj4ge1xuICAgICAgY29uc3QgdXJsID0gdXJscy5jYXNpbm9NZ3IudGFibGVGaWx0ZXI7XG4gICAgICByZXR1cm4gdGhpcy5odHRwLmdldDxIdHRwUmVzcG9uc2U8T2JqZWN0Pj4odXJsLCBvcHRpb25zKTtcbiAgICB9XG4gICAgZ2V0RmlsdGVyRm9yUGxheWVyKG9wdGlvbnM6IHt9KTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8T2JqZWN0Pj4ge1xuICAgICAgICBjb25zdCB1cmwgPSB1cmxzLmNhc2lub01nci5wbGF5ZXJGaWx0ZXI7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PEh0dHBSZXNwb25zZTxPYmplY3Q+Pih1cmwsIG9wdGlvbnMpO1xuICAgIH1cbiAgICBnZXRBY3RpdmVQbGF5ZXIob3B0aW9uczoge30pOiBPYnNlcnZhYmxlPEh0dHBSZXNwb25zZTxPYmplY3Q+PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHVybHMuY2FzaW5vTWdyLmFjdGl2ZVBsYXllcjtcbiAgICAgICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8SHR0cFJlc3BvbnNlPE9iamVjdD4+KHVybCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGdldFVzZXJTZWFyY2gob3B0aW9uczoge30pOiBPYnNlcnZhYmxlPEh0dHBSZXNwb25zZTxPYmplY3Q+PiB7XG4gICAgICAgIGNvbnN0IHVybCA9IHVybHMuY2FzaW5vTWdyLnVzZXJTZWFyY2g7XG4gICAgICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PEh0dHBSZXNwb25zZTxPYmplY3Q+Pih1cmwsIG9wdGlvbnMpO1xuICAgIH1cbiAgICAvLyBnZXRwYWdpbmF0ZWRTZXNzaW9ucyhwYXlsb2FkICwgb3B0aW9uczoge30pOiBPYnNlcnZhYmxlPEh0dHBSZXNwb25zZTxPYmplY3Q+PiB7XG4gICAgLy8gICAgIGNvbnN0IGZpbmFsVXJsID0gJ2h0dHA6Ly8xNzIuMzEuMi45Mjo4MDgwL2FwaS9nYW1lL3YxL3BhZ2luYXRlZFNlc3Npb25zJztcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuaHR0cC5wb3N0PEh0dHBSZXNwb25zZTxPYmplY3Q+PihmaW5hbFVybCwgcGF5bG9hZCwgb3B0aW9ucyk7XG4gICAgLy8gfVxuICAgIC8vIGdldHBhZ2luYXRlZEdhbWVzKG9wdGlvbnM6IHt9KTogT2JzZXJ2YWJsZTxIdHRwUmVzcG9uc2U8T2JqZWN0Pj4ge1xuICAgIC8vICAgICBjb25zdCBmaW5hbFVybCA9ICdodHRwOi8vMTcyLjMxLjIuOTI6ODA4MC9hcGkvZ2FtZS92MS9wYWdpbmF0ZWRHYW1lcyc7XG4gICAgLy8gICAgIC8vY29uc3QgZmluYWxVcmwgPSB1cmxzLmdhbWUucGFnaW5hdGVkR2FtZXM7XG4gICAgLy8gICAgIHJldHVybiB0aGlzLmh0dHAuZ2V0PEh0dHBSZXNwb25zZTxPYmplY3Q+PihmaW5hbFVybCwgb3B0aW9ucyk7XG4gICAgLy8gfVxufVxuIl19