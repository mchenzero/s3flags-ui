import { Pipe, PipeTransform } from "@angular/core";
import { Flag } from "../common/services/flag.service";
import { SearchCriteria } from "./search-box.component";

@Pipe({ name: "search" })
export class SearchPipe implements PipeTransform {
  public transform(flags: Flag[], criteria: SearchCriteria): Flag[] {
    if (!criteria) {
      return flags;
    }

    let result = flags;

    if (criteria.name) {
      const name = criteria.name.toLowerCase();
      result = result.filter(flag => flag.name && flag.name.toLowerCase() === name);
    }

    if (criteria.createdBy) {
      const createdBy = criteria.createdBy.toLowerCase();
      result = result.filter(flag => flag.createdBy && flag.createdBy.toLowerCase() === createdBy);
    }

    if (criteria.updatedBy) {
      const updatedBy = criteria.updatedBy.toLowerCase();
      result = result.filter(flag => flag.updatedBy && flag.updatedBy.toLowerCase() === updatedBy);
    }

    if (criteria.tags) {
      for (const tag of criteria.tags.map(t => t.toLowerCase())) {
        result = result.filter(flag => flag.tags && flag.tags.map(t => t.toLowerCase()).includes(tag));
      }
    }

    if (criteria.$search) {
      for (const word of criteria.$search.toLowerCase().split(/\s+/)) {
        result = result.filter(flag => {
          if (flag.name.toLowerCase().includes(word)) {
            return true;
          }

          if (flag.description.toLowerCase().includes(word)) {
            return true;
          }

          if (flag.createdBy.toLowerCase().includes(word)) {
            return true;
          }

          if (flag.updatedBy.toLowerCase().includes(word)) {
            return true;
          }

          if (flag.tags.some(tag => tag.toLowerCase().includes(word))) {
            return true;
          }

          if (flag.environments) {
            for (const env of Object.keys(flag.environments)) {
              const { value, updatedBy } = flag.environments[env];
              if (updatedBy && updatedBy.toLowerCase().includes(word)) {
                return true;
              }
              if (value != null && String(value).toLowerCase().includes(word)) {
                return true;
              }
            }
          }

          return false;
        });
      }
    }

    return result;
  }
}
