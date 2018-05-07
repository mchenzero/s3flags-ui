import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "deleted" })
export class DeletedPipe implements PipeTransform {
  public transform<T extends { deletedAt: string | null }>(arr: T[], value?: boolean): T[] {
    if (typeof value === "undefined" || value) {
      return arr.filter(item => item.deletedAt);
    } else {
      return arr.filter(item => !item.deletedAt);
    }
  }
}
