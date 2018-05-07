import { Component } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgForm } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { FlagService, FlagSlim } from "../common/services/flag.service";

import "rxjs/add/observable/of";
import "rxjs/add/operator/take";

export interface SearchCriteria {
  name?: string;
  createdBy?: string;
  updatedBy?: string;
  tags?: string[];
  $search?: string;
}

@Component({
  selector: "search-box",
  templateUrl: "./search-box.component.html",
  styleUrls: ["./search-box.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SearchBoxComponent,
      multi: true
    }
  ]
})
export class SearchBoxComponent implements ControlValueAccessor {
  public tags: any[] = [];
  public text: string = "";
  public searchCriteria: SearchCriteria = {};

  private notifyOnChange: any;

  public writeValue(searchCriteria: any): void {
    this.tags = [];
    this.text = "";

    if (!searchCriteria) {
      this.searchCriteria = {};
      return;
    }

    if (searchCriteria.name) {
      this.tags.push(`name: ${searchCriteria.name}`);
    }

    if (searchCriteria.createdBy) {
      this.tags.push(`owner: ${searchCriteria.createdBy}`);
    }

    if (searchCriteria.updatedBy) {
      this.tags.push(`updatedBy: ${searchCriteria.updatedBy}`);
    }

    if (searchCriteria.tags) {
      for (const tag of searchCriteria.tags.slice().sort()) {
        this.tags.push(`tag: ${tag}`);
      }
    }

    if (searchCriteria.$search) {
      this.text = searchCriteria.$search;
    }

    this.searchCriteria = searchCriteria;
  }

  public registerOnChange(fn: any): void {
    this.notifyOnChange = fn;
  }

  public registerOnTouched(fn: any): void {
    // don't need this so far
  }

  public updateSearchCriteria(text?: string): void {
    if (typeof text === "undefined") {
      text = this.text;
    }

    const searchCriteria: SearchCriteria = {};

    const nameTag = this.tags.find(t => this.isNameTag(t));
    const ownerTag = this.tags.find(t => this.isOwnerTag(t));
    const updatedByTag = this.tags.find(t => this.isUpdatedByTag(t));
    const tagTags = this.tags.filter(t => this.isTagTag(t));

    if (nameTag) {
      searchCriteria.name = this.getNameTagValue(nameTag);
    }

    if (ownerTag) {
      searchCriteria.createdBy = this.getOwnerTagValue(ownerTag);
    }

    if (updatedByTag) {
      searchCriteria.updatedBy = this.getUpdatedByTagValue(updatedByTag);
    }

    for (const tag of tagTags) {
      if (!searchCriteria.tags) {
        searchCriteria.tags = [];
      }
      searchCriteria.tags.push(this.getTagTagValue(tag) as string);
    }

    if (this.isNameTag(text)) {
      const value = this.getNameTagValue(text);
      if (value) {
        searchCriteria.name = value;
      }
    } else if (this.isOwnerTag(text)) {
      const value = this.getOwnerTagValue(text);
      if (value) {
        searchCriteria.createdBy = value;
      }
    } else if (this.isUpdatedByTag(text)) {
      const value = this.getUpdatedByTagValue(text);
      if (value) {
        searchCriteria.updatedBy = value;
      }
    } else if (this.isTagTag(text)) {
      const value = this.getTagTagValue(text);
      if (value && !this.hasTagTag(value)) {
        if (!searchCriteria.tags) {
          searchCriteria.tags = [];
        }
        searchCriteria.tags.push(value);
      }
    } else if (text) {
      searchCriteria.$search = text;
    }

    if (searchCriteria.tags) {
      searchCriteria.tags.sort();
    }

    if (JSON.stringify(searchCriteria) !== JSON.stringify(this.searchCriteria)) {
      this.searchCriteria = searchCriteria;
      if (this.notifyOnChange) {
        this.notifyOnChange(searchCriteria);
      }
    }
  }

  public addTagInterceptor = (tag: string): Observable<any> => {
    const nameTagValue = this.getNameTagValue(tag);

    if (nameTagValue) {
      const nameTagIndex = this.tags.findIndex(t => this.isNameTag(t));
      if (nameTagIndex >= 0) {
        this.tags.splice(nameTagIndex, 1);
      }
      return Observable.of(`name: ${nameTagValue}`);
    }

    const ownerTagValue = this.getOwnerTagValue(tag);

    if (ownerTagValue) {
      const ownerTagIndex = this.tags.findIndex(t => this.isOwnerTag(t));
      if (ownerTagIndex >= 0) {
        this.tags.splice(ownerTagIndex, 1);
      }
      return Observable.of(`owner: ${ownerTagValue}`);
    }

    const updatedByTagValue = this.getUpdatedByTagValue(tag);

    if (updatedByTagValue) {
      const updatedByTagIndex = this.tags.findIndex(t => this.isUpdatedByTag(t));
      if (updatedByTagIndex >= 0) {
        this.tags.splice(updatedByTagIndex, 1);
      }
      return Observable.of(`updatedBy: ${updatedByTagValue}`);
    }

    const tagTagValue = this.getTagTagValue(tag);

    if (tagTagValue) {
      // duplicate tags are handled by tag-input
      return Observable.of(`tag: ${tagTagValue}`);
    }

    // return an empty observable so that no tag is to be added
    // the `pipe` method is hacked to return itself to avoid an error
    const observable = Observable.of(void 0).take(0);
    observable.pipe = () => observable;
    return observable;
  }

  private isNameTag(tag: any): boolean {
    return /^name:/i.test(tag.value || tag);
  }

  private isOwnerTag(tag: any): boolean {
    return /^owner:/i.test(tag.value || tag);
  }

  private isUpdatedByTag(tag: any): boolean {
    return /^updatedBy:/i.test(tag.value || tag);
  }

  private isTagTag(tag: any): boolean {
    return /^tag:/i.test(tag.value || tag);
  }

  private hasNameTag(): boolean {
    return this.tags.some(tag => this.isNameTag(tag));
  }

  private hasOwnerTag(): boolean {
    return this.tags.some(tag => this.isOwnerTag(tag));
  }

  private hasUpdatedByTag(): boolean {
    return this.tags.some(tag => this.isUpdatedByTag(tag));
  }

  private hasTagTag(value: string): boolean {
    return this.tags.some(tag => this.getTagTagValue(tag) === value);
  }

  private getNameTagValue(tag: any): string | undefined {
    if (this.isNameTag(tag)) {
      return (tag.value || tag).replace(/^name:/i, "").trim();
    }
  }

  private getOwnerTagValue(tag: any): string | undefined {
    if (this.isOwnerTag(tag)) {
      return (tag.value || tag).replace(/^owner:/i, "").trim();
    }
  }

  private getUpdatedByTagValue(tag: any): string | undefined {
    if (this.isUpdatedByTag(tag)) {
      return (tag.value || tag).replace(/^updatedBy:/i, "").trim();
    }
  }

  private getTagTagValue(tag: any): string | undefined {
    if (this.isTagTag(tag)) {
      return (tag.value || tag).replace(/^tag:/i, "").trim();
    }
  }
}
