/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import { HttpClient, RequestParams } from "./http-client";

export class CleanupNoDownloadManga<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Maintenance
   * @name CleanupNoDownloadMangaCreate
   * @summary Removes all API.Schema.MangaContext.Manga not marked for Download on any API.MangaConnectors.MangaConnector
   * @request POST:/CleanupNoDownloadManga
   */
  cleanupNoDownloadMangaCreate = (params: RequestParams = {}) =>
    this.request<void, string>({
      path: `/CleanupNoDownloadManga`,
      method: "POST",
      ...params,
    });
}
