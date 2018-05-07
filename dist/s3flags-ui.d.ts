/// <reference types="express" />
import { Handler, Request } from "express";
declare module "s3flags/dist/s3flags" {
    interface S3Flags {
        ui(userTracker: (req: Request) => string): Handler;
    }
}
