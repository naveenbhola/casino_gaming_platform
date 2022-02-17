import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {urls} from 'common-ui';
import {
    ChipsInventoryInterface,
    LocalGamingDayInterface,
    RollTimeInterface,
    RollTimePayloadInterface,
    ChipTrayOpenerCloser
} from '../interface/cage.interface';

@Injectable({
    providedIn: 'root'
})
export class CageService {
    constructor(private http: HttpClient) {

    }

    getInventoryData(id, options: {}): Observable<ChipsInventoryInterface[]> {
        return this.http.get<ChipsInventoryInterface[]>
        (urls.cage.chipsInventory + id, options);
    }

    getLocalGamingDay(id): Observable<LocalGamingDayInterface> {
        return this.http.get<LocalGamingDayInterface>(urls.cage.localGamingDay,
            {
                params: {
                    topologyId: id
                }
            });
    }
    getRollTimeData(options: {}): Observable<RollTimeInterface[]> {
        const url = urls.cage.nextRollDtm;
        return this.http.get<RollTimeInterface[]>(url, options);
    }
    postRollTimeData(payLoad: {}): Observable<HttpResponse<RollTimePayloadInterface>> {
        const url = urls.cage.nextRollDtm;
        return this.http.post<HttpResponse<RollTimePayloadInterface>>(url, payLoad);
    }
    getChipTrayOpenerCloser(options: {}): Observable<ChipTrayOpenerCloser> {
      //console.log('options in cageService #@@', options);
      return this.http.get<ChipTrayOpenerCloser>(urls.cage.chipTrayOpenerCloser,
        {
          params: {
            topologyId: options['topologyId'],
            gamingDay: options['gamingDay']
          }
        });
    }
}
