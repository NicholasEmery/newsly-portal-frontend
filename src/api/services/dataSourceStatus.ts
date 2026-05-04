import {
  checkApiReadiness,
  type DataSourceMode,
} from "@/api/connection/http";
import { IS_DEV_BUILD } from "@/config/buildTarget";

export type DataSourceStatusReason =
  | "ok"
  | "datasource-env-missing-dev"
  | "mock-directory-missing-dev"
  | "api-unavailable"
  | "api-unavailable-use-mocks"
  | "api-and-mock-unavailable";

export type DataSourceStatus = {
  canRender: boolean;
  reason: DataSourceStatusReason;
  datasource: DataSourceMode | "none";
};

export const getDataSourceStatus = async (): Promise<DataSourceStatus> => {
  // compatibility helper: decide dev vs prod at runtime. The dev implementation
  // lives in `dataSourceStatus.dev.ts` and is only dynamically imported when
  // `IS_DEV_BUILD` is true so it won't be included in production builds.
  if (IS_DEV_BUILD) {
    const mod = await import("./dataSourceStatus.dev");
    return mod.getDevDataSourceStatus();
  }

  const apiReady = await checkApiReadiness(1500);

  if (apiReady) {
    return {
      canRender: true,
      reason: "ok",
      datasource: "api",
    };
  }

  // API not ready and in production we don't consider mocks -> indicate 'none'
  return {
    canRender: false,
    reason: "api-unavailable",
    datasource: "none",
  };
};
