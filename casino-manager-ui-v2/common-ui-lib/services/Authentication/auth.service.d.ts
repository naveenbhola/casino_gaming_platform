import { HttpBackend } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export declare class AuthService {
    private http;
    constructor(httpBackend: HttpBackend);
    getRefreshToken(clientId: any): Observable<any>;
    logout(): Observable<Object>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<AuthService, never>;
}

//# sourceMappingURL=auth.service.d.ts.map