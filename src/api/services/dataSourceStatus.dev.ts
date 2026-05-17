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

export const getDevDataSourceStatus = async (): Promise<DataSourceStatus> => {
  // Only used in dev builds
  const mode = resolveDataSourceMode();
  const dataSourceEnvConfigured = isDataSourceEnvConfigured();
  const hasMocks = hasMocksDirectory();

  const unavailableDisplaySource = "indisponível (API e mocks)";

  if (!dataSourceEnvConfigured) {
    return {
      canRender: false,
      reason: "datasource-env-missing-dev",
      datasource: mode as DataSourceMode,
      displaySource: unavailableDisplaySource,
    };
  }

  const shouldCheckApi = mode === "api" || mode === "auto";
  const apiReady = shouldCheckApi ? await checkApiReadiness(1500) : false;

  const canRender =
    mode === "api"
      ? apiReady
      : mode === "mock"
        ? hasMocks
        : apiReady || hasMocks;

  let reason: DataSourceStatusReason = "ok";
  if (!canRender) {
    if (mode === "mock" && !hasMocks) {
      reason = "mock-directory-missing-dev";
    } else if (mode === "api" && !apiReady) {
      reason = "api-unavailable";
    } else {
      reason = "api-and-mock-unavailable";
    }
  }

  const datasource: DataSourceMode | "none" =
    mode === "mock"
      ? hasMocks
        ? "mock"
        : "none"
      : mode === "api"
        ? apiReady
          ? "api"
          : "none"
        : apiReady
          ? "api"
          : hasMocks
            ? "mock"
            : "none";

  const displaySource =
    mode === "auto"
      ? apiReady
        ? "api"
        : hasMocks
          ? "mock"
          : unavailableDisplaySource
      : mode === "mock"
        ? "mock"
        : "api";

  return {
    canRender,
    reason,
    datasource,
    displaySource,
  };
};

export const getDevHomeDataSourceStatus = getDevDataSourceStatus;
