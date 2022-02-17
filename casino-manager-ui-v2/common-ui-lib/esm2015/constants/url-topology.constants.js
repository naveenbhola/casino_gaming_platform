import { protocol, webServerDNS } from './url.common.constants';
const basePath = '/api/topology';
const version = '/v1/';
const baseUrl = protocol + webServerDNS + basePath + version;
export const topology = {
    topologyGroups: baseUrl + 'topologyGroups/',
    topologyTypes: baseUrl + 'topologyTypes/',
    topologyNodes: baseUrl + 'topologyNodes/',
    virtualGroupNodesUrl: baseUrl + 'topologyGroups/?groupType=VIRTUAL&userId='
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLXRvcG9sb2d5LmNvbnN0YW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1vbi11aS12Mi9zcmMvYXBwL2NvbnN0YW50cy91cmwtdG9wb2xvZ3kuY29uc3RhbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUUsWUFBWSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFTOUQsTUFBTSxRQUFRLEdBQUcsZUFBZSxDQUFDO0FBQ2pDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQztBQUN2QixNQUFNLE9BQU8sR0FBRyxRQUFRLEdBQUcsWUFBWSxHQUFHLFFBQVEsR0FBRyxPQUFPLENBQUM7QUFFN0QsTUFBTSxDQUFDLE1BQU0sUUFBUSxHQUFrQztJQUNuRCxjQUFjLEVBQUUsT0FBTyxHQUFHLGlCQUFpQjtJQUMzQyxhQUFhLEVBQUUsT0FBTyxHQUFHLGdCQUFnQjtJQUN6QyxhQUFhLEVBQUUsT0FBTyxHQUFHLGdCQUFnQjtJQUN6QyxvQkFBb0IsRUFBRSxPQUFPLEdBQUcsMkNBQTJDO0NBQzlFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3Byb3RvY29sLCB3ZWJTZXJ2ZXJETlN9IGZyb20gJy4vdXJsLmNvbW1vbi5jb25zdGFudHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFVybFRvcG9sb2d5Q29uc3RhbnRzSW50ZXJmYWNlIHtcbiAgICB0b3BvbG9neUdyb3Vwczogc3RyaW5nO1xuICAgIHRvcG9sb2d5VHlwZXM6IHN0cmluZztcbiAgICB0b3BvbG9neU5vZGVzOiBzdHJpbmc7XG4gICAgdmlydHVhbEdyb3VwTm9kZXNVcmw6IHN0cmluZztcbn1cblxuY29uc3QgYmFzZVBhdGggPSAnL2FwaS90b3BvbG9neSc7XG5jb25zdCB2ZXJzaW9uID0gJy92MS8nO1xuY29uc3QgYmFzZVVybCA9IHByb3RvY29sICsgd2ViU2VydmVyRE5TICsgYmFzZVBhdGggKyB2ZXJzaW9uO1xuXG5leHBvcnQgY29uc3QgdG9wb2xvZ3k6IFVybFRvcG9sb2d5Q29uc3RhbnRzSW50ZXJmYWNlID0ge1xuICAgIHRvcG9sb2d5R3JvdXBzOiBiYXNlVXJsICsgJ3RvcG9sb2d5R3JvdXBzLycsXG4gICAgdG9wb2xvZ3lUeXBlczogYmFzZVVybCArICd0b3BvbG9neVR5cGVzLycsXG4gICAgdG9wb2xvZ3lOb2RlczogYmFzZVVybCArICd0b3BvbG9neU5vZGVzLycsXG4gICAgdmlydHVhbEdyb3VwTm9kZXNVcmw6IGJhc2VVcmwgKyAndG9wb2xvZ3lHcm91cHMvP2dyb3VwVHlwZT1WSVJUVUFMJnVzZXJJZD0nXG59O1xuXG4iXX0=