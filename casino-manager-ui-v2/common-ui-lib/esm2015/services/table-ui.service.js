import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tableUIProtocol } from '../constants/url.common.constants';
import { tableUIPort } from '../constants/url.common.constants';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
const URL = tableUIProtocol + 'tableui:' + tableUIPort;
const API_SUB_PATH = '/api/table/v1/';
export class TableUIService {
    constructor(http) {
        this.http = http;
    }
    isLoggedIn(clientId) {
        const url = `${URL}${API_SUB_PATH}login?clientId=${clientId}`;
        return this.http.get(url);
    }
}
TableUIService.ɵprov = i0.ɵɵdefineInjectable({ factory: function TableUIService_Factory() { return new TableUIService(i0.ɵɵinject(i1.HttpClient)); }, token: TableUIService, providedIn: "root" });
TableUIService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
TableUIService.ctorParameters = () => [
    { type: HttpClient }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtdWkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1vbi11aS12Mi9zcmMvYXBwL3NlcnZpY2VzL3RhYmxlLXVpLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDaEQsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBQ2xFLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQzs7O0FBRTlELE1BQU0sR0FBRyxHQUFHLGVBQWUsR0FBRyxVQUFVLEdBQUcsV0FBVyxDQUFDO0FBQ3ZELE1BQU0sWUFBWSxHQUFHLGdCQUFnQixDQUFDO0FBS3RDLE1BQU0sT0FBTyxjQUFjO0lBRXpCLFlBQW9CLElBQWdCO1FBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7SUFBSSxDQUFDO0lBQ3pDLFVBQVUsQ0FBQyxRQUFRO1FBQ2pCLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLFlBQVksa0JBQWtCLFFBQVEsRUFBRSxDQUFDO1FBQzlELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQU0sR0FBRyxDQUFDLENBQUM7SUFDakMsQ0FBQzs7OztZQVRGLFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7O1lBVE8sVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7SHR0cENsaWVudH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHt0YWJsZVVJUHJvdG9jb2x9IGZyb20gJy4uL2NvbnN0YW50cy91cmwuY29tbW9uLmNvbnN0YW50cyc7XG5pbXBvcnQge3RhYmxlVUlQb3J0fSBmcm9tICcuLi9jb25zdGFudHMvdXJsLmNvbW1vbi5jb25zdGFudHMnO1xuXG5jb25zdCBVUkwgPSB0YWJsZVVJUHJvdG9jb2wgKyAndGFibGV1aTonICsgdGFibGVVSVBvcnQ7XG5jb25zdCBBUElfU1VCX1BBVEggPSAnL2FwaS90YWJsZS92MS8nO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBUYWJsZVVJU2VydmljZSB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7IH1cbiAgaXNMb2dnZWRJbihjbGllbnRJZCkge1xuICAgIGNvbnN0IHVybCA9IGAke1VSTH0ke0FQSV9TVUJfUEFUSH1sb2dpbj9jbGllbnRJZD0ke2NsaWVudElkfWA7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQ8YW55Pih1cmwpO1xuICB9XG59XG4iXX0=