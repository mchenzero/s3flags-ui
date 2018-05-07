import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FlagInfo, FlagInfoSlim, FlagValueTypes, S3FlagsConfig } from "s3flags";

export interface Flag<T extends FlagValueTypes = FlagValueTypes> extends FlagInfo<T> {
  name: string;
}

export interface FlagSlim<T extends FlagValueTypes = FlagValueTypes> extends FlagInfoSlim<T> {
  name: string;
}

@Injectable()
export class FlagService {
  private cache: any = {};

  constructor(private http: HttpClient) {}

  public async get<T extends FlagValueTypes>(name: string, options?: { refresh?: boolean }): Promise<Flag<T> | null> {
    const flags = await this.getAll(options);
    return flags.find(flag => flag.name === name) as Flag<T> || null;
  }

  public async getAll(options?: { refresh?: boolean }): Promise<Flag[]> {
    if (!this.cache.flags || options && options.refresh) {
      this.cache.flags = await this.http.get("api/flags").toPromise();
    }
    return this.cache.flags;
  }

  public async getServerConfig(options?: { refresh?: boolean }): Promise<S3FlagsConfig> {
    if (!this.cache.config || options && options.refresh) {
      this.cache.config = await this.http.get("api/config").toPromise();
    }
    return this.cache.config;
  }

  public async create<T extends FlagValueTypes>(flag: FlagSlim<T>): Promise<void> {
    return this.http.post("api/flags", flag).toPromise().then(() => void 0);
  }

  public async update(flag: Flag): Promise<void> {
    const url = `api/flags/${encodeURIComponent(flag.name)}`;
    return this.http.put(url, flag).toPromise().then(() => void 0);
  }

  public async delete(flag: Flag, options?: { permanent?: boolean }): Promise<void> {
    const url = `api/flags/${encodeURIComponent(flag.name)}`;
    const params = { permanent: options && options.permanent && "true" || "false" };
    return this.http.delete(url, { params }).toPromise().then(() => void 0);
  }
}
