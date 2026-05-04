"use client";

import React from "react";

export type NoticeComponentProps = {
  attributes?: Record<string, string>;
  children?: React.ReactNode;
  rawHtml?: string;
};

export type NoticeComponentType = React.FC<NoticeComponentProps>;

const registry: Record<string, NoticeComponentType> = {};

export function registerComponent(name: string, comp: NoticeComponentType) {
  registry[name.toLowerCase()] = comp;
}

export function getComponent(name: string): NoticeComponentType | undefined {
  return registry[name.toLowerCase()];
}

export function listComponents() {
  return Object.keys(registry);
}

export default registry;
