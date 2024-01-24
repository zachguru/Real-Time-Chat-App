import { HttpHeaders } from '@angular/common/http';

export function getHeaders(): HttpHeaders {
    const accessToken = sessionStorage.getItem('token');

    let headers = new HttpHeaders();

    if (accessToken) {
        headers = headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
}
