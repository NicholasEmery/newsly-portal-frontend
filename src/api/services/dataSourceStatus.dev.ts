import {
  checkApiReadiness,
  isDataSourceEnvConfigured,
  resolveDataSourceMode,
  type DataSourceMode,
} from "@/api/connection/http";
import { hasMocksDirectory } from "@/api/mocks";
import type {
  DataSourceStatus,
  DataSourceStatusReason,
} from "./dataSourceStatus";

export const getDevDataSourceStatus =
  async (): Promise<DataSourceStatus> => {
    // Only used in dev builds
    const mode = resolveDataSourceMode();
    const dataSourceEnvConfigured = isDataSourceEnvConfigured();
    const hasMocks = hasMocksDirectory();

    if (!dataSourceEnvConfigured) {
      return {
        canRender: false,
        reason: "datasource-env-missing-dev",
        datasource: mode as DataSourceMode,
      };
    }

    const shouldCheckApi = mode === "api" || mode === "auto";
    const apiReady = shouldCheckApi ? await checkApiReadiness(1500) : false;

    const canRender = apiReady || hasMocks;

    let reason: DataSourceStatusReason = "ok";
    if (!canRender) reason = "api-and-mock-unavailable";
    else if (!apiReady && hasMocks && mode === "api")
      reason = "api-unavailable-use-mocks";

    // determine datasource that will be used when rendering (use 'none' when
    // both api and mocks are unavailable)
    const datasource: DataSourceMode | "none" = apiReady
      ? "api"
      : hasMocks
        ? "mock"
        : "none";

    return {
      canRender,
      reason,
      datasource,
    };
  };

export const getDevHomeDataSourceStatus = getDevDataSourceStatus;
