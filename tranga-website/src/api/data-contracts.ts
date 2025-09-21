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
    Failed = 'Failed',
    Cancelled = 'Cancelled',
    Created = 'Created',
    Waiting = 'Waiting',
    Running = 'Running',
    Completed = 'Completed',
}

export enum RequestType {
    Default = 'Default',
    MangaDexFeed = 'MangaDexFeed',
    MangaImage = 'MangaImage',
    MangaCover = 'MangaCover',
    MangaDexImage = 'MangaDexImage',
    MangaInfo = 'MangaInfo',
}

export enum MangaReleaseStatus {
    Continuing = 'Continuing',
    Completed = 'Completed',
    OnHiatus = 'OnHiatus',
    Cancelled = 'Cancelled',
    Unreleased = 'Unreleased',
}

export enum LibraryType {
    Komga = 'Komga',
    Kavita = 'Kavita',
}

export enum LibraryRefreshSetting {
    AfterAllFinished = 'AfterAllFinished',
    AfterMangaFinished = 'AfterMangaFinished',
    AfterEveryChapter = 'AfterEveryChapter',
    WhileDownloading = 'WhileDownloading',
}

export enum CoverSize {
    Original = 'Original',
    Large = 'Large',
    Medium = 'Medium',
    Small = 'Small',
}

/** API.Schema.MangaContext.AltTitle DTO */
export interface AltTitle {
    /**
     * Language of the Title
     * @minLength 1
     */
    language: string;
    /**
     * Title
     * @minLength 1
     */
    title: string;
}

/** The API.Schema.MangaContext.Author DTO */
export interface Author {
    /**
     * Name of the Author.
     * @minLength 1
     */
    name: string;
    /**
     * Unique Identifier of the DTO
     * @minLength 16
     * @maxLength 64
     */
    key: string;
}

/** API.Schema.MangaContext.Chapter DTO */
export interface Chapter {
    /**
     * Identifier of the Manga this Chapter belongs to
     * @minLength 1
     */
    mangaId: string;
    /**
     * Volume number
     * @format int32
     */
    volume: number;
    /**
     * Chapter number
     * @minLength 1
     */
    chapterNumber: string;
    /**
     * Title of the Chapter
     * @minLength 1
     */
    title: string;
    /** Whether Chapter is Downloaded (on disk) */
    downloaded: boolean;
    /** Ids of the Manga on MangaConnectors */
    mangaConnectorIds: MangaConnectorId[];
    /**
     * Unique Identifier of the DTO
     * @minLength 16
     * @maxLength 64
     */
    key: string;
}

export interface CreateGotifyConnectorRecord {
    /**
     * The Name of the Notification Connector
     * @minLength 1
     */
    name: string;
    /**
     * The Url of the Instance
     * @format uri
     * @minLength 1
     */
    url: string;
    /**
     * The Apptoken used for authentication
     * @minLength 1
     */
    appToken: string;
    /**
     * The Priority of Notifications
     * @format int32
     */
    priority: number;
}

export interface CreateLibraryConnectorRecord {
    libraryType: LibraryType;
    /**
     * The Url of the Library instance
     * @format uri
     * @minLength 1
     */
    url: string;
    /**
     * The Username to authenticate to the Library instance
     * @minLength 1
     */
    username: string;
    /**
     * The Password to authenticate to the Library instance
     * @minLength 1
     */
    password: string;
}

export interface CreateLibraryRecord {
    /**
     * The directory Path of the library
     * @minLength 1
     */
    basePath: string;
    /**
     * The Name of the library
     * @minLength 1
     */
    libraryName: string;
}

export interface CreateNotificationConnectorRecord {
    /**
     * The Name of the Notification Connector
     * @minLength 1
     */
    name: string;
    /**
     * The Url of the Instance
     * @format uri
     * @minLength 1
     */
    url: string;
    /**
     * The HTTP Request Method to use for notifications
     * @minLength 1
     */
    httpMethod: string;
    /**
     * The Request Body to use to send notifications
     * @minLength 1
     */
    body: string;
    /** The Request Headers to use to send notifications */
    headers: Record<string, string>;
}

export interface CreateNtfyConnectorRecord {
    /**
     * The Name of the Notification Connector
     * @minLength 1
     */
    name: string;
    /**
     * The Url of the Instance
     * @format uri
     * @minLength 1
     */
    url: string;
    /**
     * The Priority of Notifications
     * @format int32
     */
    priority: number;
    /**
     * The Username used for authentication
     * @minLength 1
     */
    username: string;
    /**
     * The Password used for authentication
     * @minLength 1
     */
    password: string;
    /**
     * The Topic of Notifications
     * @minLength 1
     */
    topic: string;
}

export interface CreatePushoverConnectorRecord {
    /**
     * The Name of the Notification Connector
     * @minLength 1
     */
    name: string;
    /**
     * The Apptoken used for authentication
     * @minLength 1
     */
    appToken: string;
    /**
     * The Username used for authentication
     * @minLength 1
     */
    username: string;
}

export interface FileLibrary {
    /**
     * The directory Path of the library
     * @minLength 1
     */
    basePath: string;
    /**
     * The Name of the library
     * @minLength 1
     */
    libraryName: string;
    /**
     * Unique Identifier of the DTO
     * @minLength 16
     * @maxLength 64
     */
    key: string;
}

export interface LibraryConnector {
    /**
     * The Url of the Library instance
     * @format uri
     * @minLength 1
     */
    baseUrl: string;
    type: LibraryType;
    /**
     * Unique Identifier of the DTO
     * @minLength 16
     * @maxLength 64
     */
    key: string;
}

/** API.Schema.MangaContext.Link DTO */
export interface Link {
    /**
     * Name of the Provider
     * @minLength 1
     */
    provider: string;
    /**
     * Url
     * @minLength 1
     */
    url: string;
    /**
     * Unique Identifier of the DTO
     * @minLength 16
     * @maxLength 64
     */
    key: string;
}

/** API.Schema.MangaContext.Manga DTO */
export interface Manga {
    /**
     * Chapter cutoff for Downloads (Chapters before this will not be downloaded)
     * @format float
     */
    ignoreChaptersBefore: number;
    /**
     * Release Year
     * @format int32
     */
    year?: number | null;
    /** Release Language */
    originalLanguage?: string | null;
    /** Keys of ChapterDTOs */
    chapterIds: string[];
    /** Author-names */
    authors: Author[];
    /** Manga Tags */
    tags: string[];
    /** Links for more Metadata */
    links: Link[];
    /** Alt Titles of Manga */
    altTitles: AltTitle[];
    /**
     * Id of the Library the Manga gets downloaded to
     * @minLength 1
     */
    fileLibraryId: string;
    /**
     * Name of the Manga
     * @minLength 1
     */
    name: string;
    /**
     * Description of the Manga
     * @minLength 1
     */
    description: string;
    releaseStatus: MangaReleaseStatus;
    /** Ids of the Manga on MangaConnectors */
    mangaConnectorIds: MangaConnectorId[];
    /**
     * Unique Identifier of the DTO
     * @minLength 16
     * @maxLength 64
     */
    key: string;
}

export interface MangaConnector {
    name?: string | null;
    /** Whether Connector is used for Searches and Downloads */
    enabled: boolean;
    /** Languages supported by the Connector */
    supportedLanguages: string[];
    /**
     * Url of the Website Icon
     * @minLength 1
     */
    iconUrl: string;
    /**
     * Unique Identifier of the DTO
     * @minLength 16
     * @maxLength 64
     */
    key: string;
}

/** API.Schema.MangaContext.MangaConnectorId`1 DTO */
export interface MangaConnectorId {
    /**
     * Name of the Connector
     * @minLength 1
     */
    mangaConnectorName: string;
    /**
     * Key of the referenced DTO
     * @minLength 1
     */
    foreignKey: string;
    /** Website Link for reference, if any */
    websiteUrl?: string | null;
    /** Whether this Link is used for downloads */
    useForDownload: boolean;
    /**
     * Unique Identifier of the DTO
     * @minLength 16
     * @maxLength 64
     */
    key: string;
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

/** Shortened Version of API.Controllers.DTOs.Manga */
export interface MinimalManga {
    /**
     * Name of the Manga
     * @minLength 1
     */
    name: string;
    /**
     * Description of the Manga
     * @minLength 1
     */
    description: string;
    releaseStatus: MangaReleaseStatus;
    /** Ids of the Manga on MangaConnectors */
    mangaConnectorIds: MangaConnectorId[];
    /**
     * Unique Identifier of the DTO
     * @minLength 16
     * @maxLength 64
     */
    key: string;
}

export interface NotificationConnector {
    /**
     * The Name of the Notification Connector
     * @minLength 1
     */
    name: string;
    /**
     * The Url of the Instance
     * @format uri
     * @minLength 1
     */
    url: string;
    /**
     * The HTTP Request Method to use for notifications
     * @minLength 1
     */
    httpMethod: string;
    /**
     * The Request Body to use to send notifications
     * @minLength 1
     */
    body: string;
    /** The Request Headers to use to send notifications */
    headers: Record<string, string>;
    /**
     * Unique Identifier of the DTO
     * @minLength 16
     * @maxLength 64
     */
    key: string;
}

export interface PatchLibraryRefreshRecord {
    setting: LibraryRefreshSetting;
    /**
     * When API.Workers.LibraryRefreshSetting.WhileDownloading is selected, update the time between refreshes
     * @format int32
     */
    refreshLibraryWhileDownloadingEveryMinutes?: number | null;
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

export interface TrangaSettings {
    defaultDownloadLocation?: string | null;
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
    /** @format int32 */
    maxConcurrentDownloads?: number;
    /** @format int32 */
    maxConcurrentWorkers?: number;
    libraryRefreshSetting?: LibraryRefreshSetting;
    /** @format int32 */
    refreshLibraryWhileDownloadingEveryMinutes?: number;
}

/** API.Workers.BaseWorker DTO */
export interface Worker {
    /** Workers this worker depends on having ran. */
    dependencies: string[];
    /** Workers that have not yet ran, that need to run for this Worker to run. */
    missingDependencies: string[];
    /** Worker can run. */
    dependenciesFulfilled: boolean;
    state: WorkerExecutionState;
    /**
     * Unique Identifier of the DTO
     * @minLength 16
     * @maxLength 64
     */
    key: string;
}
