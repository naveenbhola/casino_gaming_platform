import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export interface UserSearchComplex {
    authHistoryId: number;
    creationDate: string;
    employeeId: number;
    firstName: string;
    ip: string;
    lastName: string;
    location: string;
    meta: string;
    title: string;
    type: string;
    userId: number;
    userName: string;
    userType: string;
}
export interface UserSearchNormal {
    employeeNumber: number;
    firstName: string;
    isActive: number;
    language: string;
    lastName: string;
    roles: Array<any>;
    title: string;
    userAccessGroups: Array<any>;
    userId: number;
    userName: string;
}
/**
 *  providedIn: 'root', }) export class UserService { } 'root' means that we want provide the service at the root level (AppModule)
 *  When you provide the service at the root level, Angular creates a single, shared instance of service and injects into any class
 *  that asks for it.
 */
export declare class UserService {
    private http;
    userSearchComplexUrl: string;
    userSearchNormalUrl: string;
    constructor(http: HttpClient);
    getComplexSearchedUsers(): Observable<UserSearchComplex[]>;
    getNormalSearchedUsers(options?: {}): Observable<HttpResponse<Object>>;
    getUserById(userId: any, options: {}): Observable<HttpResponse<Object>>;
    setFavoriteApp(paramObj: any, userId: any): Observable<Object>;
    changeStatus(user: any, options?: {}): Observable<HttpResponse<Object>>;
    getRoles(options: {}): Observable<HttpResponse<Object>>;
    createUpdateUser(options?: {
        userId: number;
    }): Observable<HttpResponse<Object>>;
    getAssignedRolesAppList(options: {}): Observable<HttpResponse<Object>>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<UserService, never>;
}

//# sourceMappingURL=user.service.d.ts.map