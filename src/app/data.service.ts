import { Injectable } from '@angular/core';
import { Http, Response, Headers ,RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Configuration } from './configuration';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class DataService<Type> {
    private resolveSuffix: string = '?resolve=true';
    private actionUrl: string;
    private headers: Headers;
    private cookies: string = 'Cookie';
    private connect_sid: string = 'connect.sid';
    private access_token: string = 'access_token';
    private userId: string = 'userId';
    private _cookieService:CookieService;

    public createKey(key: string){
        if(this._cookieService.get(key) == null){  console.log('errrrrrrror'); return; }
        return key + '=' + this._cookieService.get(key) + ';';
    }

    constructor(private http: Http, private _configuration: Configuration, _cookieService:CookieService) {
	this._cookieService = _cookieService;
        this.actionUrl = _configuration.ServerWithApiUrl;

    }

    public getAll(ns: string): Observable<Type[]> {
        console.log('GetAll ' + ns + ' to ' + this.actionUrl + ns);
	this.headers = new Headers();
	
        var cookiesValue = this.createKey(this.connect_sid) + this.createKey(this.access_token) + this.createKey(this.userId);
        console.log("Cookie " , cookiesValue);
        this.headers.append('Cookie' , cookiesValue);
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('Accept', 'application/json');
        return this.http.get(`${this.actionUrl}${ns}` , {withCredentials: true,headers: this.headers})
          .map(this.extractData)
          .catch(this.handleError);
    }

    public getSingle(ns: string, id: string): Observable<Type> {
        console.log('GetSingle ' + ns);

        return this.http.get(this.actionUrl + ns + '/' + id + this.resolveSuffix)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public add(ns: string, asset: Type): Observable<Type> {
        console.log('Entered DataService add');
        console.log('Add ' + ns);
        console.log('asset', asset);

        return this.http.post(this.actionUrl + ns, asset)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public update(ns: string, id: string, itemToUpdate: Type): Observable<Type> {
        console.log('Update ' + ns);
        console.log('what is the id?', id);
        console.log('what is the updated item?', itemToUpdate);
        console.log('what is the updated item?', JSON.stringify(itemToUpdate));
        return this.http.put(`${this.actionUrl}${ns}/${id}`, itemToUpdate)
          .map(this.extractData)
          .catch(this.handleError);
    }

    public delete(ns: string, id: string): Observable<Type> {
        console.log('Delete ' + ns);

        return this.http.delete(this.actionUrl + ns + '/' + id)
          .map(this.extractData)
          .catch(this.handleError);
    }

    private handleError(error: any): Observable<string> {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
          error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    private extractData(res: Response): any {
        return res.json();
    }

}
