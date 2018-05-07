import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DialogService } from "ngx-bootstrap-modal";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";
import { Flag, FlagService } from "../common/services/flag.service";
import { UserService } from "../common/services/user.service";
import { SearchCriteria } from "../search-box/search-box.component";

import "rxjs/add/observable/from";
import "rxjs/add/observable/of";
import "rxjs/add/operator/combineLatest";
import "rxjs/add/operator/delay";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/takeUntil";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit, OnDestroy {
  public flags: Flag[] = [];
  public user: string | undefined;
  public defaultEnv: string | undefined;
  public searchCriteria: SearchCriteria = {};
  public recycleMode: boolean = false;
  public loading: boolean = false;

  private destroyed = new Subject<void>();

  constructor(private route: ActivatedRoute, private router: Router,
              private flagService: FlagService, private userService: UserService,
              private dialogService: DialogService) {}

  public ngOnInit(): void {
    this.route.queryParams
      .takeUntil(this.destroyed)
      .subscribe(params => {
        const newSearchCriteria = {
          name: params.n,
          createdBy: params.o,
          updatedBy: params.u,
          tags: params.t && [].concat(params.t),
          $search: params.s
        };
        if (!this.isEqual(this.searchCriteria, newSearchCriteria)) {
          this.searchCriteria = newSearchCriteria;
        }
      });

    this.route.queryParams
      .combineLatest(
        Observable.from(this.userService.getUser()),
        Observable.from(this.flagService.getServerConfig()),
        Observable.from(this.refresh())
      )
      .takeUntil(this.destroyed)
      .subscribe(([params, user, config]) => {
        this.user = user;
        this.defaultEnv = config.defaultEnv;
        if (Object.keys(params).length === 0) {
          if (this.flags.some(flag => flag.createdBy === this.user)) {
            return this.updateQuery({ o: this.user });
          } else {
            return this.updateQuery({ nos: 1 }); // no owner search
          }
        }
      });
  }

  public ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  public refresh(options = { padIntSecs: true }): Promise<void> {
    if (this.loading) {
      return Promise.resolve();
    }

    const start = Date.now();

    this.loading = true;

    return this.flagService.getAll({ refresh: true })
      .then(flags => {
        // pad to integer seconds for better animation
        // this also means it takes at least 1 second for the refresh to finish
        // so that user knows the refresh is indeed triggered
        const duration = Date.now() - start;
        const padding = 1000 - duration % 1000;
        return Observable.of(flags).delay(padding).toPromise();
      })
      .then(flags => {
        this.loading = false;
        this.flags = flags;
      })
      .catch(err => {
        this.loading = false;
        this.showAlert("Error", "Failed to get flags! Please try again later.");
      });
  }

  public updateSearchCriteria(searchCriteria: SearchCriteria): void {
    this.searchCriteria = searchCriteria;

    const queryParams: any = {
      n: searchCriteria.name,
      o: searchCriteria.createdBy,
      u: searchCriteria.updatedBy,
      t: searchCriteria.tags,
      s: searchCriteria.$search
    };

    if (Object.keys(queryParams).filter(key => queryParams[key]).length === 0) {
      queryParams.nos = 1; // nos: no owner search
    }

    this.updateQuery(queryParams);
  }

  public delete(flag: Flag): void {
    const confirmMsg = `Do you really want to delete <strong class="mark">${flag.name}</strong>?`;

    this.showConfirm("Warning", confirmMsg)
      .then(confirmed => {
        if (confirmed) {
          return this.flagService.delete(flag)
            .then(() => this.refresh())
            .catch(err => {
              this.showAlert("Error", "Failed to delete flag! Please try again later.");
            });
        }
    });
  }

  public undelete(flag: Flag): void {
    // TODO: implement this
    this.dialogService.show({
      type: "default",
      className: "modal-size-fix",
      title: "Information",
      content: "Not implemented yet...",
      confirmButtonText: "OK",
      showCancelButton: false
    });
  }

  public cleanupDeletedFlags(): void {
    // TODO: implement this
    this.dialogService.show({
      type: "default",
      className: "modal-size-fix",
      title: "Information",
      content: "Not implemented yet...",
      confirmButtonText: "OK",
      showCancelButton: false
    });
  }

  public flagTrackByFn(index: number, item: Flag): string {
    return item.name;
  }

  private showConfirm(title: string, content: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.dialogService.show({
        type: "confirm",
        className: "modal-size-fix",
        title,
        content,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        confirmButtonClass: "btn-danger",
        onHide: resolve
      });
    });
  }

  private showAlert(title: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.dialogService.show({
        type: "default",
        className: "modal-size-fix",
        title,
        content,
        confirmButtonText: "OK",
        confirmButtonClass: "btn-danger",
        showCancelButton: false,
        onHide: resolve
      });
    });
  }

  private updateQuery(params: Params): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: params });
  }

  private isEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
}
