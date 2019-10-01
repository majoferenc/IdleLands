import { Injectable } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable()
export class RouterStub {
    public url;
    private subject = new Subject();
    public events = this.subject.asObservable();

    navigate(url: string) {
        this.url = url;
        this.triggerNavEvents(url);
    }

    triggerNavEvents(url) {
        const ne = new NavigationEnd(0, url, null);
        this.subject.next(ne);
    }
}
