import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { DialogService } from "ngx-bootstrap-modal";
import { FlagService, FlagSlim } from "../common/services/flag.service";
import { NavigationService } from "../common/services/navigation.service";

@Component({
  selector: "app-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"]
})
export class CreateComponent implements OnInit {
  public flag: FlagSlim = {
    name: "",
    description: "",
    environments: {},
    tags: []
  };

  public rawTagModels: any[] = [];
  public tagInputText: string = "";

  public flagType = "boolean";
  public environments: string[] = [];
  public loading: Promise<any> | undefined;
  public submitting: boolean = false;

  constructor(private flagService: FlagService, private dialogService: DialogService,
              private navigationService: NavigationService) {}

  public ngOnInit(): void {
    this.loading = this.flagService.getServerConfig()
      .then(config => {
        this.environments = config.environments;
        this.resetValues();
      });
  }

  public resetValues(): void {
    switch (this.flagType) {
      case "boolean":
        this.flag.environments = Object.assign({}, ...this.environments.map(env => ({
          [env]: { value: false }
        })));
        break;
      case "string":
        this.flag.environments = Object.assign({}, ...this.environments.map(env => ({
          [env]: { value: "" }
        })));
        break;
      case "number":
        this.flag.environments = Object.assign({}, ...this.environments.map(env => ({
          [env]: { value: 0 }
        })));
        break;
      default:
        throw new Error("unknown flag type");
    }
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
    // TODO: add more validations (e.g. avoid creating existing flags)
    if (form.valid && !this.submitting) {
      this.submitting = true;
      this.flagService.create(this.flag)
        .then(() => {
          this.dialogService.show({
            type: "default",
            className: "modal-size-fix",
            title: "Information",
            content: `
              Creation of <mark>${this.flag.name}</mark> has been requested. However, it might take a while for the
              flag to appear due to server cache.
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
            content: "Failed to create flag! Please try again later.",
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
