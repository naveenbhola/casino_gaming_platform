import { protocol, webServerDNS } from './url.common.constants';
const basePath = '/api/topology';
const version = '/v1/';
const commonPath = 'topologyNodes/';
const topologyGroupPath = 'topologyGroups/';
const baseUrl = protocol + webServerDNS + basePath + version;
export const topologyTree = {
    topologyNodesUrls: baseUrl + commonPath,
    topologyTreeNodesUrl: baseUrl + commonPath + 'hierarchy',
    unassignedNondeUrl: baseUrl + commonPath + 'global/UNASSIGNED',
    accessGroupNodesUrl: baseUrl + topologyGroupPath
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLXRvcG9sb2d5dHJlZS5jb25zdGFudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tb24tdWktdjIvc3JjL2FwcC9jb25zdGFudHMvdXJsLXRvcG9sb2d5dHJlZS5jb25zdGFudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQVM5RCxNQUFNLFFBQVEsR0FBRyxlQUFlLENBQUM7QUFDakMsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3ZCLE1BQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDO0FBQ3BDLE1BQU0saUJBQWlCLEdBQUcsaUJBQWlCLENBQUM7QUFDNUMsTUFBTSxPQUFPLEdBQUcsUUFBUSxHQUFHLFlBQVksR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDO0FBRTdELE1BQU0sQ0FBQyxNQUFNLFlBQVksR0FBc0M7SUFDM0QsaUJBQWlCLEVBQUUsT0FBTyxHQUFHLFVBQVU7SUFDdkMsb0JBQW9CLEVBQUUsT0FBTyxHQUFHLFVBQVUsR0FBRyxXQUFXO0lBQ3hELGtCQUFrQixFQUFFLE9BQU8sR0FBRyxVQUFVLEdBQUcsbUJBQW1CO0lBQzlELG1CQUFtQixFQUFFLE9BQU8sR0FBRyxpQkFBaUI7Q0FDbkQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7cHJvdG9jb2wsIHdlYlNlcnZlckROU30gZnJvbSAnLi91cmwuY29tbW9uLmNvbnN0YW50cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXJsVG9wb2xvZ3lUcmVlQ29uc3RhbnRzSW50ZXJmYWNlIHtcbiAgICB0b3BvbG9neVRyZWVOb2Rlc1VybDogc3RyaW5nO1xuICAgIHVuYXNzaWduZWROb25kZVVybDogc3RyaW5nO1xuICAgIHRvcG9sb2d5Tm9kZXNVcmxzOiBzdHJpbmc7XG4gICAgYWNjZXNzR3JvdXBOb2Rlc1VybDogc3RyaW5nO1xufVxuXG5jb25zdCBiYXNlUGF0aCA9ICcvYXBpL3RvcG9sb2d5JztcbmNvbnN0IHZlcnNpb24gPSAnL3YxLyc7XG5jb25zdCBjb21tb25QYXRoID0gJ3RvcG9sb2d5Tm9kZXMvJztcbmNvbnN0IHRvcG9sb2d5R3JvdXBQYXRoID0gJ3RvcG9sb2d5R3JvdXBzLyc7XG5jb25zdCBiYXNlVXJsID0gcHJvdG9jb2wgKyB3ZWJTZXJ2ZXJETlMgKyBiYXNlUGF0aCArIHZlcnNpb247XG5cbmV4cG9ydCBjb25zdCB0b3BvbG9neVRyZWU6IFVybFRvcG9sb2d5VHJlZUNvbnN0YW50c0ludGVyZmFjZSA9IHtcbiAgICB0b3BvbG9neU5vZGVzVXJsczogYmFzZVVybCArIGNvbW1vblBhdGgsXG4gICAgdG9wb2xvZ3lUcmVlTm9kZXNVcmw6IGJhc2VVcmwgKyBjb21tb25QYXRoICsgJ2hpZXJhcmNoeScsXG4gICAgdW5hc3NpZ25lZE5vbmRlVXJsOiBiYXNlVXJsICsgY29tbW9uUGF0aCArICdnbG9iYWwvVU5BU1NJR05FRCcsXG4gICAgYWNjZXNzR3JvdXBOb2Rlc1VybDogYmFzZVVybCArIHRvcG9sb2d5R3JvdXBQYXRoXG59O1xuXG4iXX0=