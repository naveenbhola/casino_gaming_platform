import { protocol, webServerDNS } from './url.common.constants';
const basePath = '/api/casinomanager';
const version = '/v1/';
const authBasePath = '/api/auth';
const baseUrl = protocol + webServerDNS + basePath + version;
export const casinoMgr = {
    topologyStatistics: baseUrl + 'topologyStatistics',
    topologyStatisticsForVirtualGroup: baseUrl + 'topologyStatisticsForVirtualGroup',
    topologyStatisticsTabularView: baseUrl + 'topologyStatisticsTabularView',
    topologyStatisticsGridView: baseUrl + 'topologyStatisticsWithCount',
    topologyStatsByTableType: baseUrl + 'topologyStatsByTableType',
    playerStatistics: baseUrl + 'playerStatistics',
    topLosingCasino: baseUrl + 'playerStats/topLosingCasino',
    topWinningCasino: baseUrl + 'playerStats/topWinningCasino',
    topLosingPlayersVirtualGroup: baseUrl + 'playerStats/topLosingPlayersVirtualGroup',
    topWinningPlayersVirtualGroup: baseUrl + 'playerStats/topWinningPlayersVirtualGroup',
    tableFilter: baseUrl + 'filter',
    playerFilter: baseUrl + 'playerFilter',
    updatePlayer: baseUrl + 'updatePlayer',
    activePlayer: baseUrl + 'activePlayer',
    userSearch: protocol + webServerDNS + authBasePath + version + 'users/',
    paginatedSearchManualRatings: baseUrl + 'paginatedSearchManualRatings',
    updateManualRating: baseUrl + 'manualRatings/',
    manualRatingNote: baseUrl + 'manualRatingNote/',
    topologyStatsTabularView: baseUrl + 'topologyStatsTabularView'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLWNhc2lub21hbmFnZXIuY29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbW9uLXVpLXYyL3NyYy9hcHAvY29uc3RhbnRzL3VybC1jYXNpbm9tYW5hZ2VyLmNvbnN0YW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFFLFlBQVksRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBd0I5RCxNQUFNLFFBQVEsR0FBRyxvQkFBb0IsQ0FBQztBQUN0QyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdkIsTUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDO0FBQ2pDLE1BQU0sT0FBTyxHQUFHLFFBQVEsR0FBRyxZQUFZLEdBQUcsUUFBUSxHQUFHLE9BQU8sQ0FBQztBQUU3RCxNQUFNLENBQUMsTUFBTSxTQUFTLEdBQWdDO0lBQ2xELGtCQUFrQixFQUFFLE9BQU8sR0FBRyxvQkFBb0I7SUFDbEQsaUNBQWlDLEVBQUUsT0FBTyxHQUFHLG1DQUFtQztJQUNoRiw2QkFBNkIsRUFBRSxPQUFPLEdBQUcsK0JBQStCO0lBQ3hFLDBCQUEwQixFQUFFLE9BQU8sR0FBRyw2QkFBNkI7SUFDbkUsd0JBQXdCLEVBQUUsT0FBTyxHQUFHLDBCQUEwQjtJQUM5RCxnQkFBZ0IsRUFBRSxPQUFPLEdBQUcsa0JBQWtCO0lBQzlDLGVBQWUsRUFBRSxPQUFPLEdBQUcsNkJBQTZCO0lBQ3hELGdCQUFnQixFQUFFLE9BQU8sR0FBRyw4QkFBOEI7SUFDMUQsNEJBQTRCLEVBQUUsT0FBTyxHQUFHLDBDQUEwQztJQUNsRiw2QkFBNkIsRUFBRSxPQUFPLEdBQUcsMkNBQTJDO0lBQ3BGLFdBQVcsRUFBRSxPQUFPLEdBQUcsUUFBUTtJQUMvQixZQUFZLEVBQUUsT0FBTyxHQUFHLGNBQWM7SUFDdEMsWUFBWSxFQUFFLE9BQU8sR0FBRyxjQUFjO0lBQ3RDLFlBQVksRUFBRSxPQUFPLEdBQUcsY0FBYztJQUN0QyxVQUFVLEVBQUUsUUFBUSxHQUFHLFlBQVksR0FBRyxZQUFZLEdBQUcsT0FBTyxHQUFHLFFBQVE7SUFDdkUsNEJBQTRCLEVBQUUsT0FBTyxHQUFHLDhCQUE4QjtJQUN0RSxrQkFBa0IsRUFBRSxPQUFPLEdBQUcsZ0JBQWdCO0lBQzlDLGdCQUFnQixFQUFFLE9BQU8sR0FBRyxtQkFBbUI7SUFDL0Msd0JBQXdCLEVBQUUsT0FBTyxHQUFHLDBCQUEwQjtDQUNqRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtwcm90b2NvbCwgd2ViU2VydmVyRE5TfSBmcm9tICcuL3VybC5jb21tb24uY29uc3RhbnRzJztcblxuZXhwb3J0IGludGVyZmFjZSBVcmxDYXNpbm9Db25zdGFudHNJbnRlcmZhY2Uge1xuICAgIHRvcG9sb2d5U3RhdGlzdGljczogc3RyaW5nO1xuICAgIHRvcG9sb2d5U3RhdGlzdGljc0ZvclZpcnR1YWxHcm91cDogU3RyaW5nO1xuICAgIHRvcG9sb2d5U3RhdGlzdGljc1RhYnVsYXJWaWV3OiBzdHJpbmc7XG4gICAgdG9wb2xvZ3lTdGF0aXN0aWNzR3JpZFZpZXc6IHN0cmluZztcbiAgICB0b3BvbG9neVN0YXRzQnlUYWJsZVR5cGU6IHN0cmluZztcbiAgICBwbGF5ZXJTdGF0aXN0aWNzOiBzdHJpbmc7XG4gICAgdG9wTG9zaW5nQ2FzaW5vOiBzdHJpbmc7XG4gICAgdG9wV2lubmluZ0Nhc2lubzogc3RyaW5nO1xuICAgIHRvcExvc2luZ1BsYXllcnNWaXJ0dWFsR3JvdXA6IHN0cmluZztcbiAgICB0b3BXaW5uaW5nUGxheWVyc1ZpcnR1YWxHcm91cDogc3RyaW5nO1xuICAgIHRhYmxlRmlsdGVyOiBzdHJpbmc7XG4gICAgcGxheWVyRmlsdGVyOiBzdHJpbmc7XG4gICAgdXBkYXRlUGxheWVyOiBzdHJpbmc7XG4gICAgYWN0aXZlUGxheWVyOiBzdHJpbmc7XG4gICAgdXNlclNlYXJjaDogc3RyaW5nO1xuICAgIHBhZ2luYXRlZFNlYXJjaE1hbnVhbFJhdGluZ3M6IHN0cmluZztcbiAgICB1cGRhdGVNYW51YWxSYXRpbmc6IHN0cmluZztcbiAgICBtYW51YWxSYXRpbmdOb3RlOiBzdHJpbmc7XG4gICAgdG9wb2xvZ3lTdGF0c1RhYnVsYXJWaWV3OiBzdHJpbmc7XG59XG5cbmNvbnN0IGJhc2VQYXRoID0gJy9hcGkvY2FzaW5vbWFuYWdlcic7XG5jb25zdCB2ZXJzaW9uID0gJy92MS8nO1xuY29uc3QgYXV0aEJhc2VQYXRoID0gJy9hcGkvYXV0aCc7XG5jb25zdCBiYXNlVXJsID0gcHJvdG9jb2wgKyB3ZWJTZXJ2ZXJETlMgKyBiYXNlUGF0aCArIHZlcnNpb247XG5cbmV4cG9ydCBjb25zdCBjYXNpbm9NZ3I6IFVybENhc2lub0NvbnN0YW50c0ludGVyZmFjZSA9IHtcbiAgICB0b3BvbG9neVN0YXRpc3RpY3M6IGJhc2VVcmwgKyAndG9wb2xvZ3lTdGF0aXN0aWNzJyxcbiAgICB0b3BvbG9neVN0YXRpc3RpY3NGb3JWaXJ0dWFsR3JvdXA6IGJhc2VVcmwgKyAndG9wb2xvZ3lTdGF0aXN0aWNzRm9yVmlydHVhbEdyb3VwJyxcbiAgICB0b3BvbG9neVN0YXRpc3RpY3NUYWJ1bGFyVmlldzogYmFzZVVybCArICd0b3BvbG9neVN0YXRpc3RpY3NUYWJ1bGFyVmlldycsXG4gICAgdG9wb2xvZ3lTdGF0aXN0aWNzR3JpZFZpZXc6IGJhc2VVcmwgKyAndG9wb2xvZ3lTdGF0aXN0aWNzV2l0aENvdW50JyxcbiAgICB0b3BvbG9neVN0YXRzQnlUYWJsZVR5cGU6IGJhc2VVcmwgKyAndG9wb2xvZ3lTdGF0c0J5VGFibGVUeXBlJyxcbiAgICBwbGF5ZXJTdGF0aXN0aWNzOiBiYXNlVXJsICsgJ3BsYXllclN0YXRpc3RpY3MnLFxuICAgIHRvcExvc2luZ0Nhc2lubzogYmFzZVVybCArICdwbGF5ZXJTdGF0cy90b3BMb3NpbmdDYXNpbm8nLFxuICAgIHRvcFdpbm5pbmdDYXNpbm86IGJhc2VVcmwgKyAncGxheWVyU3RhdHMvdG9wV2lubmluZ0Nhc2lubycsXG4gICAgdG9wTG9zaW5nUGxheWVyc1ZpcnR1YWxHcm91cDogYmFzZVVybCArICdwbGF5ZXJTdGF0cy90b3BMb3NpbmdQbGF5ZXJzVmlydHVhbEdyb3VwJyxcbiAgICB0b3BXaW5uaW5nUGxheWVyc1ZpcnR1YWxHcm91cDogYmFzZVVybCArICdwbGF5ZXJTdGF0cy90b3BXaW5uaW5nUGxheWVyc1ZpcnR1YWxHcm91cCcsXG4gICAgdGFibGVGaWx0ZXI6IGJhc2VVcmwgKyAnZmlsdGVyJyxcbiAgICBwbGF5ZXJGaWx0ZXI6IGJhc2VVcmwgKyAncGxheWVyRmlsdGVyJyxcbiAgICB1cGRhdGVQbGF5ZXI6IGJhc2VVcmwgKyAndXBkYXRlUGxheWVyJyxcbiAgICBhY3RpdmVQbGF5ZXI6IGJhc2VVcmwgKyAnYWN0aXZlUGxheWVyJyxcbiAgICB1c2VyU2VhcmNoOiBwcm90b2NvbCArIHdlYlNlcnZlckROUyArIGF1dGhCYXNlUGF0aCArIHZlcnNpb24gKyAndXNlcnMvJyxcbiAgICBwYWdpbmF0ZWRTZWFyY2hNYW51YWxSYXRpbmdzOiBiYXNlVXJsICsgJ3BhZ2luYXRlZFNlYXJjaE1hbnVhbFJhdGluZ3MnLFxuICAgIHVwZGF0ZU1hbnVhbFJhdGluZzogYmFzZVVybCArICdtYW51YWxSYXRpbmdzLycsXG4gICAgbWFudWFsUmF0aW5nTm90ZTogYmFzZVVybCArICdtYW51YWxSYXRpbmdOb3RlLycsXG4gICAgdG9wb2xvZ3lTdGF0c1RhYnVsYXJWaWV3OiBiYXNlVXJsICsgJ3RvcG9sb2d5U3RhdHNUYWJ1bGFyVmlldydcbn07XG5cbiJdfQ==