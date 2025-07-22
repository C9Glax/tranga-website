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

export enum WorkerExecutionState {
  Failed = "Failed",
  Cancelled = "Cancelled",
  Created = "Created",
  Waiting = "Waiting",
  Running = "Running",
  Completed = "Completed",
}

export enum RequestType {
  Default = "Default",
  MangaDexFeed = "MangaDexFeed",
  MangaImage = "MangaImage",
  MangaCover = "MangaCover",
  MangaDexImage = "MangaDexImage",
  MangaInfo = "MangaInfo",
}

export enum MangaReleaseStatus {
  Continuing = "Continuing",
  Completed = "Completed",
  OnHiatus = "OnHiatus",
  Cancelled = "Cancelled",
  Unreleased = "Unreleased",
}

export enum LibraryType {
  Komga = "Komga",
  Kavita = "Kavita",
}

export interface AltTitle {
  /**
   * @minLength 0
   * @maxLength 8
   */
  language: string;
  /**
   * @minLength 0
   * @maxLength 256
   */
  title: string;
  key?: string | null;
}

export interface Author {
  /**
   * @minLength 0
   * @maxLength 128
   */
  authorName: string;
  key?: string | null;
}

export interface BaseWorker {
  /** Workers this Worker depends on being completed before running. */
  dependsOn?: BaseWorker[] | null;
  /** Dependencies and dependencies of dependencies. See also API.Workers.BaseWorker.DependsOn. */
  allDependencies?: BaseWorker[] | null;
  /** API.Workers.BaseWorker.AllDependencies and Self. */
  dependenciesAndSelf?: BaseWorker[] | null;
  /** API.Workers.BaseWorker.DependsOn where API.Workers.WorkerExecutionState is less than Completed. */
  missingDependencies?: BaseWorker[] | null;
  allDependenciesFulfilled?: boolean;
  key?: string | null;
}

export interface Chapter {
  /**
   * @minLength 0
   * @maxLength 64
   */
  parentMangaId: string;
  idsOnMangaConnectors?: Record<string, string>;
  /** @format int32 */
  volumeNumber?: number | null;
  /**
   * @minLength 0
   * @maxLength 10
   */
  chapterNumber: string;
  /**
   * @minLength 0
   * @maxLength 256
   */
  title?: string | null;
  /**
   * @minLength 0
   * @maxLength 256
   */
  fileName: string;
  downloaded: boolean;
  fullArchiveFilePath?: string | null;
  key?: string | null;
}

export interface ChapterMangaConnectorId {
  /**
   * @minLength 0
   * @maxLength 64
   */
  objId: string;
  /**
   * @minLength 0
   * @maxLength 32
   */
  mangaConnectorName: string;
  /**
   * @minLength 0
   * @maxLength 256
   */
  idOnConnectorSite: string;
  /**
   * @format uri
   * @minLength 0
   * @maxLength 512
   */
  websiteUrl?: string | null;
  useForDownload?: boolean;
  key?: string | null;
}

export interface FileLibrary {
  /**
   * @minLength 0
   * @maxLength 256
   */
  basePath: string;
  /**
   * @minLength 0
   * @maxLength 512
   */
  libraryName: string;
  key?: string | null;
}

export interface GotifyRecord {
  name?: string | null;
  endpoint?: string | null;
  appToken?: string | null;
  /** @format int32 */
  priority?: number;
}

export interface LibraryConnector {
  libraryType: LibraryType;
  /**
   * @format uri
   * @minLength 0
   * @maxLength 256
   */
  baseUrl: string;
  /**
   * @minLength 0
   * @maxLength 256
   */
  auth: string;
  key?: string | null;
}

export interface Link {
  /**
   * @minLength 0
   * @maxLength 64
   */
  linkProvider: string;
  /**
   * @format uri
   * @minLength 0
   * @maxLength 2048
   */
  linkUrl: string;
  key?: string | null;
}

export interface Manga {
  /**
   * @minLength 0
   * @maxLength 512
   */
  name: string;
  /** @minLength 1 */
  description: string;
  releaseStatus: MangaReleaseStatus;
  /**
   * @minLength 0
   * @maxLength 64
   */
  libraryId?: string | null;
  authors?: Author[] | null;
  mangaTags?: MangaTag[] | null;
  links?: Link[] | null;
  altTitles?: AltTitle[] | null;
  /** @format float */
  ignoreChaptersBefore: number;
  /**
   * @minLength 0
   * @maxLength 1024
   */
  directoryName: string;
  /** @format int32 */
  year?: number | null;
  /**
   * @minLength 0
   * @maxLength 8
   */
  originalLanguage?: string | null;
  chapterIds?: string[] | null;
  idsOnMangaConnectors?: Record<string, string>;
  mangaConnectorIdsIds?: string[] | null;
  key?: string | null;
}

export interface MangaConnector {
  /**
   * @minLength 0
   * @maxLength 32
   */
  name: string;
  /**
   * @minLength 0
   * @maxLength 8
   */
  supportedLanguages: string[];
  /**
   * @minLength 0
   * @maxLength 2048
   */
  iconUrl: string;
  /**
   * @minLength 0
   * @maxLength 256
   */
  baseUris: string[];
  enabled: boolean;
}

export interface MangaMangaConnectorId {
  /**
   * @minLength 0
   * @maxLength 64
   */
  objId: string;
  /**
   * @minLength 0
   * @maxLength 32
   */
  mangaConnectorName: string;
  /**
   * @minLength 0
   * @maxLength 256
   */
  idOnConnectorSite: string;
  /**
   * @format uri
   * @minLength 0
   * @maxLength 512
   */
  websiteUrl?: string | null;
  useForDownload?: boolean;
  key?: string | null;
}

export interface MangaTag {
  /**
   * @minLength 0
   * @maxLength 64
   */
  tag: string;
}

export interface MetadataEntry {
  mangaId?: string | null;
  metadataFetcherName?: string | null;
  identifier?: string | null;
}

export interface MetadataSearchResult {
  identifier?: string | null;
  name?: string | null;
  url?: string | null;
  description?: string | null;
  coverUrl?: string | null;
}

export interface NotificationConnector {
  /**
   * @minLength 0
   * @maxLength 64
   */
  name: string;
  /**
   * @format uri
   * @minLength 0
   * @maxLength 2048
   */
  url: string;
  headers: Record<string, string>;
  /**
   * @minLength 0
   * @maxLength 8
   */
  httpMethod: string;
  /**
   * @minLength 0
   * @maxLength 4096
   */
  body: string;
}

export interface NtfyRecord {
  name?: string | null;
  endpoint?: string | null;
  username?: string | null;
  password?: string | null;
  topic?: string | null;
  /** @format int32 */
  priority?: number;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
}

export interface PushoverRecord {
  name?: string | null;
  appToken?: string | null;
  user?: string | null;
}

export interface TrangaSettings {
  downloadLocation?: string | null;
  userAgent?: string | null;
  /** @format int32 */
  imageCompression?: number;
  blackWhiteImages?: boolean;
  flareSolverrUrl?: string | null;
  /**
   * Placeholders:
   * %M Obj Name
   * %V Volume
   * %C Chapter
   * %T Title
   * %A Author (first in list)
   * %I Chapter Internal ID
   * %i Obj Internal ID
   * %Y Year (Obj)
   *
   * ?_(...) replace _ with a value from above:
   * Everything inside the braces will only be added if the value of %_ is not null
   */
  chapterNamingScheme?: string | null;
  /** @format int32 */
  workCycleTimeoutMs?: number;
  requestLimits?: {
    /** @format int32 */
    Default?: number;
    /** @format int32 */
    MangaDexFeed?: number;
    /** @format int32 */
    MangaImage?: number;
    /** @format int32 */
    MangaCover?: number;
    /** @format int32 */
    MangaDexImage?: number;
    /** @format int32 */
    MangaInfo?: number;
  } | null;
  downloadLanguage?: string | null;
}
