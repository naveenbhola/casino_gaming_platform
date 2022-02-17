import {TestBed} from '@angular/core/testing';
import {CageService} from './cage.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {ChipsInventoryInterface, LocalGamingDayInterface} from '../interface/cage.interface';
import {chipsInventory} from './dummy-response/cage-service/chips-inventory';
import {urls} from '../constants/urls';
import {localGamingDay} from './dummy-response/cage-service/local-gaming-day';


xdescribe('CageService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let service: CageService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CageService]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        service = TestBed.get(CageService);

    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getInventoryData should be a GET call', () => {
        service.getInventoryData(4, {})
            .subscribe((data: ChipsInventoryInterface[]) => {
                expect(data).toEqual(chipsInventory);
            });
        const req = httpTestingController.expectOne(urls.cage.chipsInventory);
        expect(req.request.method).toEqual('GET');
        req.flush(chipsInventory);
    });

    it('getLocalGamingDay should be a GET call', () => {
        service.getLocalGamingDay(4)
            .subscribe((data: LocalGamingDayInterface) => {
                expect(data).toEqual(localGamingDay);
            });
        const req = httpTestingController.expectOne(urls.cage.localGamingDay);
        expect(req.request.method).toEqual('GET');
        req.flush(localGamingDay);
    });
});
