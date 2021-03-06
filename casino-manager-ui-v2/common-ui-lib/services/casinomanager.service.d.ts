import { Observable } from 'rxjs';
import { TopologyStatisticsTabularView, TopologyStatistics, TopologyStatisticsGridView } from '../interface/topology-types.interface';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { OpenerCloserInterface } from '../interface/casino-manager.interface';
import * as ɵngcc0 from '@angular/core';
export declare class CasinomanagerService {
    private http;
    constructor(http: HttpClient);
    getTopologyStatisticsTabularView(options: {}): Observable<TopologyStatisticsTabularView>;
    getTopologyStatsTabularView(options: {}): Observable<TopologyStatisticsTabularView>;
    getTopologyStatisticsGridView(options: {}): Observable<TopologyStatisticsGridView>;
    getTopologyStatsByTableType(options: {}, url: any): Observable<TopologyStatisticsTabularView>;
    getTopologyStatistics(gamingDay: any, topologyIds: any, viewId: any, options: {}): Observable<TopologyStatistics>;
    getTopologyStatisticsForVirtualGroup(gamingDay: any, topologyGroupId: any, viewId: any, options: {}): Observable<TopologyStatistics>;
    getTopLosingCasino(gamingDay: any, topologyId: any): Observable<HttpResponse<Object>>;
    getTopWinningCasino(gamingDay: any, topologyId: any): Observable<HttpResponse<Object>>;
    getTopLosingPlayersVirtualGroup(gamingDay: any, topologyId: any): Observable<HttpResponse<Object>>;
    getTopWinningPlayersVirtualGroup(gamingDay: any, topologyId: any): Observable<HttpResponse<Object>>;
    getPlayerStatistics(options: {}): Observable<TopologyStatisticsTabularView>;
    getPaginatedOpenerCloser(options: {}): Observable<OpenerCloserInterface>;
    getPaginatedSearchManualRatings(url: any, options: {}): Observable<HttpResponse<Object>>;
    getpaginatedSessions(payload: any, options: {}): Observable<HttpResponse<Object>>;
    getpaginatedGames(options: {}): Observable<HttpResponse<Object>>;
    getFilterForTable(options: {}): Observable<HttpResponse<Object>>;
    getFilterForPlayer(options: {}): Observable<HttpResponse<Object>>;
    getActivePlayer(options: {}): Observable<HttpResponse<Object>>;
    getUserSearch(options: {}): Observable<HttpResponse<Object>>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CasinomanagerService, never>;
}

//# sourceMappingURL=casinomanager.service.d.ts.map