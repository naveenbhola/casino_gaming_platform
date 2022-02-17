import { protocol, webServerDNS } from './url.common.constants';
const basePath = '/api/chip';
const version = '/v1/';
const baseUrl = protocol + webServerDNS + basePath + version;
export const chipSet = {
    chipSet: baseUrl + 'chipsets/configurationChipsets',
    currencyList: baseUrl + 'currency',
    companyList: baseUrl + 'company',
    updateChipSet: baseUrl + 'chipsets',
    chipTrayScan_NEW: baseUrl + 'chipTrayScans',
    missingChips: baseUrl + 'missingChipList',
    missingChipScan: baseUrl + 'getScanDetail',
    getScanCompDetail: baseUrl + 'getScanCompDetail'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLWNoaXBzZXQuY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbW9uLXVpLXYyL3NyYy9hcHAvY29uc3RhbnRzL3VybC1jaGlwc2V0LmNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFFLFlBQVksRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBYTlELE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQztBQUM3QixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdkIsTUFBTSxPQUFPLEdBQUcsUUFBUSxHQUFHLFlBQVksR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDO0FBRTdELE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBaUM7SUFDakQsT0FBTyxFQUFFLE9BQU8sR0FBRyxnQ0FBZ0M7SUFDbkQsWUFBWSxFQUFFLE9BQU8sR0FBRyxVQUFVO0lBQ2xDLFdBQVcsRUFBRSxPQUFPLEdBQUcsU0FBUztJQUNoQyxhQUFhLEVBQUUsT0FBTyxHQUFHLFVBQVU7SUFDbkMsZ0JBQWdCLEVBQUUsT0FBTyxHQUFHLGVBQWU7SUFDM0MsWUFBWSxFQUFFLE9BQU8sR0FBRyxpQkFBaUI7SUFDekMsZUFBZSxFQUFFLE9BQU8sR0FBRyxlQUFlO0lBQzFDLGlCQUFpQixFQUFFLE9BQU8sR0FBRyxtQkFBbUI7Q0FDbkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7cHJvdG9jb2wsIHdlYlNlcnZlckROU30gZnJvbSAnLi91cmwuY29tbW9uLmNvbnN0YW50cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXJsQ2hpcFNldENvbnN0YW50c0ludGVyZmFjZSB7XG4gICAgY2hpcFNldDogc3RyaW5nO1xuICAgIGN1cnJlbmN5TGlzdDogc3RyaW5nO1xuICAgIGNvbXBhbnlMaXN0OiBzdHJpbmc7XG4gICAgdXBkYXRlQ2hpcFNldDogc3RyaW5nO1xuICAgIGNoaXBUcmF5U2Nhbl9ORVc6IHN0cmluZztcbiAgICBtaXNzaW5nQ2hpcHM6IHN0cmluZztcbiAgICBtaXNzaW5nQ2hpcFNjYW46IHN0cmluZztcbiAgICBnZXRTY2FuQ29tcERldGFpbDogc3RyaW5nO1xufVxuXG5jb25zdCBiYXNlUGF0aCA9ICcvYXBpL2NoaXAnO1xuY29uc3QgdmVyc2lvbiA9ICcvdjEvJztcbmNvbnN0IGJhc2VVcmwgPSBwcm90b2NvbCArIHdlYlNlcnZlckROUyArIGJhc2VQYXRoICsgdmVyc2lvbjtcblxuZXhwb3J0IGNvbnN0IGNoaXBTZXQ6IFVybENoaXBTZXRDb25zdGFudHNJbnRlcmZhY2UgPSB7XG4gICAgY2hpcFNldDogYmFzZVVybCArICdjaGlwc2V0cy9jb25maWd1cmF0aW9uQ2hpcHNldHMnLFxuICAgIGN1cnJlbmN5TGlzdDogYmFzZVVybCArICdjdXJyZW5jeScsXG4gICAgY29tcGFueUxpc3Q6IGJhc2VVcmwgKyAnY29tcGFueScsXG4gICAgdXBkYXRlQ2hpcFNldDogYmFzZVVybCArICdjaGlwc2V0cycsXG4gICAgY2hpcFRyYXlTY2FuX05FVzogYmFzZVVybCArICdjaGlwVHJheVNjYW5zJyxcbiAgICBtaXNzaW5nQ2hpcHM6IGJhc2VVcmwgKyAnbWlzc2luZ0NoaXBMaXN0JyxcbiAgICBtaXNzaW5nQ2hpcFNjYW46IGJhc2VVcmwgKyAnZ2V0U2NhbkRldGFpbCcsXG4gICAgZ2V0U2NhbkNvbXBEZXRhaWw6IGJhc2VVcmwgKyAnZ2V0U2NhbkNvbXBEZXRhaWwnXG59O1xuXG4iXX0=