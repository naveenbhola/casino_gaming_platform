import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {TopologyStatisticsTabularView, TopologyStatistics} from '../interface/topology-types.interface';
import {urls} from 'common-ui';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {OpenerCloserInterface} from '../interface/casino-manager.interface';
import {SystemProperty} from 'common-ui/interface/configuration.interface';

@Injectable({
  providedIn: 'root'
})
export class CasinomanagerService {

  constructor( private http: HttpClient) { }
    getTopologyStatisticsTabularView(options: {}): Observable<TopologyStatisticsTabularView> {
        const url = urls.casinoMgr.topologyStatisticsTabularView;
        return this.http.get<TopologyStatisticsTabularView>(url, options);
    }
    getTopologyStatsByTableType(options: {}, url): Observable<TopologyStatisticsTabularView> {
        const finalUrl = urls.casinoMgr.topologyStatsByTableType + url;
        return this.http.get<TopologyStatisticsTabularView>(finalUrl, options);
    }
    getTopologyStatistics(gamingDay, topologyIds, viewId, options: {}): Observable<TopologyStatistics> {
      const url = `${urls.casinoMgr.topologyStatistics}?gamingDay=${gamingDay}&topologyIds=${topologyIds}&viewId=${viewId}`;
      return this.http.get<TopologyStatistics>(url, options);
    }
  getTopologyStatisticsForVirtualGroup(gamingDay, topologyGroupId, viewId, options: {}): Observable<TopologyStatistics> {
    const url = `${urls.casinoMgr.topologyStatisticsForVirtualGroup}?gamingDay=${gamingDay}&topologyGroupId=${topologyGroupId}&viewId=${viewId}`;
    return this.http.get<TopologyStatistics>(url, options);
  }
    getplayerStatistics(options: {}): Observable<TopologyStatisticsTabularView> {
        const url = urls.casinoMgr.playerStatistics;
        return this.http.get<TopologyStatisticsTabularView>(url, options);
    }
    getPaginatedOpenerCloser(options: {}): Observable<OpenerCloserInterface> {
        const finalUrl = urls.cage.paginatedOpenerCloser;
        return this.http.get<OpenerCloserInterface>(finalUrl, options);
    }
    getPaginatedSearchManualRatings(url, options: {}): Observable<HttpResponse<Object>> {
        const finalUrl = urls.game.paginatedSearchManualRatings + url;
        return this.http.post<HttpResponse<Object>>(finalUrl, options);
    }
    getpaginatedSessions(payload , options: {}): Observable<HttpResponse<Object>> {
        const finalUrl = urls.game.paginatedSessions;
        return this.http.post<HttpResponse<Object>>(finalUrl, payload, options);
    }
    getpaginatedGames(options: {}): Observable<HttpResponse<Object>> {
        const finalUrl = urls.game.paginatedGames;
        return this.http.get<HttpResponse<Object>>(finalUrl, options);
    }
    getFilterForTable(options: {}): Observable<HttpResponse<Object>> {
      const url = urls.casinoMgr.tableFilter;
      return this.http.get<HttpResponse<Object>>(url, options);
    }
    getFilterForPlayer(options: {}): Observable<HttpResponse<Object>> {
        const url = urls.casinoMgr.playerFilter;
        return this.http.get<HttpResponse<Object>>(url, options);
    }
  getPaginatedSearchManualRatingsForCasinoManager(options: any, postParams): Observable<HttpResponse<Object>> {
    const finalUrl = urls.casinoMgr.paginatedSearchManualRatings;
    return this.http.post<HttpResponse<Object>>(finalUrl, postParams , {params: options, observe: 'response'});
  }
  updateManualRatingNotes(body): Observable<HttpResponse<Object>> {
    const finalUrl   = urls.casinoMgr.manualRatingNote;
    return this.http.post<HttpResponse<Object>>(finalUrl , body) ;
  }
  getPlayers(e): Observable<HttpResponse<Object>> {
    return this.http.get<HttpResponse<Object>>('', {});
  }
  getPlayerById(q, qq) {
    return this.http.get<HttpResponse<Object>>('', {});
  }
  updateManualRating(url, reqObj) {
    const finalUrl = urls.casinoMgr.updateManualRating + url;
    return this.http.post<HttpResponse<Object>>(finalUrl, reqObj);
  }
  manualRatingUpdate() {}
  closeDialog() {}
  createManualRating(h) {
    return this.http.get<HttpResponse<Object>>('', {});
  }

  getPromotionWinnerData(options: {}): Observable<HttpResponse<Object>> {
    const url = urls.promotion.winners;
    return this.http.get<HttpResponse<Object>>(url, options);
  }

  /**
   *
   * @param url
   * responseType: 'blob' as 'json' it get as binary and convert it into Blob data
   * then we will get url from blob and set the url to HTML Iframe.
   */
  getPDF(url): Observable<HttpResponse<Blob>> {
    return this.http.get<HttpResponse<Blob>>(url, {responseType: 'blob' as 'json'});
  }


  getPromotionVoucherDetails(options: {}): Observable<HttpResponse<Object>> {
    const url = urls.promotion.promotionsWinnerVoucher + 'voucher-print-logs' ;
    return this.http.get<HttpResponse<Object>>(url, options);
  }

  getPromotionWinnerOnStatusChange(options: {}, url): Observable<HttpResponse<Object>> {
    const finalUrl = urls.promotion.promotionsWinnerVoucher + url;
    return this.http.put<HttpResponse<Object>>(finalUrl, null, options);
  }

  /**
   * get any configuration property passing property key.
   * @param property
   */
  getConfigProperty(propertyKey): Observable<SystemProperty[]> {
    return this.http.get<SystemProperty[]>(urls.config.configurations, {
      params: {
        propertyCodes: propertyKey,
        templateTypeCode: 'SYSTEM',
        type: 'TEMPLATE'
      }
    });
  }
    // getpaginatedSessions(payload , options: {}): Observable<HttpResponse<Object>> {
    //     const finalUrl = 'http://172.31.2.92:8080/api/game/v1/paginatedSessions';
    //     return this.http.post<HttpResponse<Object>>(finalUrl, payload, options);
    // }
    // getpaginatedGames(options: {}): Observable<HttpResponse<Object>> {
    //     const finalUrl = 'http://172.31.2.92:8080/api/game/v1/paginatedGames';
    //     //const finalUrl = urls.game.paginatedGames;
    //     return this.http.get<HttpResponse<Object>>(finalUrl, options);
    // }
}
