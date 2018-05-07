import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

import "rxjs/add/operator/filter";

@Injectable()
export class NavigationService {
  private urlStemToPreviousFullUrlMap: { [urlStem: string]: any } = {};

  constructor(private router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const urlStem = event.url.replace(/\?.*/, "");
        this.urlStemToPreviousFullUrlMap[urlStem] = event.url;
      }
    });
  }

  public goToDashboard(options = { restoreQuery: true }): void {
    const urlStem = "/";
    if (options.restoreQuery) {
      const fullUrl = this.urlStemToPreviousFullUrlMap[urlStem] || urlStem;
      this.router.navigateByUrl(fullUrl);
    } else {
      this.router.navigateByUrl(urlStem);
    }
  }
}
