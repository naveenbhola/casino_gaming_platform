import { protocol, webServerDNS } from './url.common.constants';
const basePath = '/api/auth';
const oAuth = '/oauth/token';
const baseUrl = protocol + webServerDNS + basePath + oAuth;
export const auth = {
    login: baseUrl + '/login',
    refresh: baseUrl + '/refresh',
    logoutWS: 'wss://' + webServerDNS + basePath + '/logoutRequest/websocket',
    logout: baseUrl + '/logout'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsLWF1dGhlbnRpY2F0aW9uLmNvbnN0YW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbW1vbi11aS12Mi9zcmMvYXBwL2NvbnN0YW50cy91cmwtYXV0aGVudGljYXRpb24uY29uc3RhbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQUUsWUFBWSxFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFTOUQsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDO0FBQzdCLE1BQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQztBQUM3QixNQUFNLE9BQU8sR0FBRyxRQUFRLEdBQUcsWUFBWSxHQUFHLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFFM0QsTUFBTSxDQUFDLE1BQU0sSUFBSSxHQUErQjtJQUM1QyxLQUFLLEVBQUUsT0FBTyxHQUFHLFFBQVE7SUFDekIsT0FBTyxFQUFFLE9BQU8sR0FBRyxVQUFVO0lBQzdCLFFBQVEsRUFBRSxRQUFRLEdBQUcsWUFBWSxHQUFHLFFBQVEsR0FBRywwQkFBMEI7SUFDekUsTUFBTSxFQUFFLE9BQU8sR0FBRyxTQUFTO0NBQzlCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge3Byb3RvY29sLCB3ZWJTZXJ2ZXJETlN9IGZyb20gJy4vdXJsLmNvbW1vbi5jb25zdGFudHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFVybEF1dGhlbnRpY2F0aW9uSW50ZXJmYWNlIHtcbiAgICBsb2dpbjogc3RyaW5nO1xuICAgIHJlZnJlc2g6IHN0cmluZztcbiAgICBsb2dvdXRXUzogc3RyaW5nO1xuICAgIGxvZ291dDogc3RyaW5nO1xufVxuXG5jb25zdCBiYXNlUGF0aCA9ICcvYXBpL2F1dGgnO1xuY29uc3Qgb0F1dGggPSAnL29hdXRoL3Rva2VuJztcbmNvbnN0IGJhc2VVcmwgPSBwcm90b2NvbCArIHdlYlNlcnZlckROUyArIGJhc2VQYXRoICsgb0F1dGg7XG5cbmV4cG9ydCBjb25zdCBhdXRoOiBVcmxBdXRoZW50aWNhdGlvbkludGVyZmFjZSA9IHtcbiAgICBsb2dpbjogYmFzZVVybCArICcvbG9naW4nLFxuICAgIHJlZnJlc2g6IGJhc2VVcmwgKyAnL3JlZnJlc2gnLFxuICAgIGxvZ291dFdTOiAnd3NzOi8vJyArIHdlYlNlcnZlckROUyArIGJhc2VQYXRoICsgJy9sb2dvdXRSZXF1ZXN0L3dlYnNvY2tldCcsXG4gICAgbG9nb3V0OiBiYXNlVXJsICsgJy9sb2dvdXQnXG59O1xuXG4iXX0=