import fyService from "@gyjx/fy-sdk/dist/zfb.js";
/* eslint-disable */

interface AppOptions {
    [key: string]: ?any;
    fyService: typeof fyService
}

declare global {
    declare function getApp (): AppOptions;
}