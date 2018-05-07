import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class UserService {
  private cache: string | undefined;

  constructor(private http: HttpClient) {}

  public async getUser(): Promise<string> {
    if (typeof this.cache === "undefined") {
      this.cache = await this.http.get<string>("api/user").toPromise();
    }
    return this.cache;
  }
}
