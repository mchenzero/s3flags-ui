import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogService } from "ngx-bootstrap-modal";
import { Subscription } from "rxjs/Subscription";
import { Flag, FlagService } from "../common/services/flag.service";
import { NavigationService } from "../common/services/navigation.service";

@Component({
  selector: "app-update",
  templateUrl: "./update.component.html",
  styleUrls: ["./update.component.scss"]
})
export class UpdateComponent implements OnInit, OnDestroy {
  public flag: Flag | undefined;
  public flagType: string | undefined;
  public environments: string[] = [];
  public loading: Promise<any> | undefined;
  public submitting: boolean = false;

  public rawTagModels: any[] = [];
  public tagInputText: string = "";

  private routeParamsSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute, private navigationService: NavigationService,
              private flagService: FlagService, private dialogService: DialogService) {}

  public ngOnInit(): void {
    this.routeParamsSubscription = this.route.params.subscribe(params => {
      const name: string = params.name;

      this.loading = Promise.all([this.flagService.get(name), this.flagService.getServerConfig()])
        .then(([flag, config]) => {
          if (!flag) {
            return this.navigationService.goToDashboard();
          }

          this.flag = flag;
          this.rawTagModels = flag.tags;
          this.environments = config.environments;

          if (this.flag) {
            const type = typeof this.flag.environments[config.defaultEnv].value;
            if (["boolean", "string", "number"].includes(type)) {
              this.flagType = type;
            } else {
              this.flagType = "boolean";
            }
          }
        });
    });
  }

  public ngOnDestroy(): void {
    this.routeParamsSubscription && this.routeParamsSubscription.unsubscribe();
  }

  public updateTags(): void {
    if (!this.flag) {
      return;
    }

    const tags = this.rawTagModels.map(t => t.value || t);
    const input = this.tagInputText.trim();

    if (input && !tags.includes(input)) {
      tags.push(input);
    }

    this.flag.tags = tags;
  }

  public submit(form: NgForm): void {
    if (form.valid && !this.submitting) {
      this.submitting = true;
      this.flagService.update(this.flag as Flag)
        .then(() => {
          this.dialogService.show({
            type: "default",
            className: "modal-size-fix",
            title: "Information",
            content: `
              Update has been requested. However, it might take a while for it to take effect due to server cache.
            `,
            confirmButtonText: "OK",
            showCancelButton: false,
            onHide: () => {
              this.submitting = false;
              this.navigationService.goToDashboard();
            }
          });
        })
        .catch(() => {
          this.dialogService.show({
            type: "default",
            className: "modal-size-fix",
            title: "Error",
            content: "Failed to update flag! Please try again later.",
            confirmButtonText: "OK",
            confirmButtonClass: "btn-danger",
            showCancelButton: false,
            onHide: () => {
              this.submitting = false;
            }
          });
        });
    }
  }
}
