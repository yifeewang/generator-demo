import fyService from "@gyjx/fy-sdk/dist/index.js";
/* eslint-disable */

declare global {
    interface Window {
        fy: typeof fyService;
    }

}
// interface window {
//     fy: typeof fyService;
// }

// declare const fy: typeof fyService;
