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

import {
    Author,
    Chapter,
    FileLibrary,
    GotifyRecord,
    LibraryConnector,
    Manga,
    MangaConnector,
    MangaConnectorId,
    MetadataEntry,
    MetadataSearchResult,
    MinimalManga,
    NotificationConnector,
    NtfyRecord,
    ProblemDetails,
    PushoverRecord,
    RequestType,
    TrangaSettings,
    Worker,
    WorkerExecutionState,
} from './data-contracts';
import { ContentType, HttpClient, RequestParams } from './http-client';

export class V2<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
    /**
     * No description
     *
     * @tags FileLibrary
     * @name FileLibraryList
     * @summary Returns all API.Schema.MangaContext.FileLibrary
     * @request GET:/v2/FileLibrary
     */
    fileLibraryList = (params: RequestParams = {}) =>
        this.request<FileLibrary[], void>({
            path: `/v2/FileLibrary`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags FileLibrary
     * @name FileLibraryUpdate
     * @summary Creates new API.Schema.MangaContext.FileLibrary
     * @request PUT:/v2/FileLibrary
     */
    fileLibraryUpdate = (data: FileLibrary, params: RequestParams = {}) =>
        this.request<void, string>({
            path: `/v2/FileLibrary`,
            method: 'PUT',
            body: data,
            type: ContentType.Json,
            ...params,
        });
    /**
     * No description
     *
     * @tags FileLibrary
     * @name FileLibraryDetail
     * @summary Returns API.Schema.MangaContext.FileLibrary with FileLibraryId
     * @request GET:/v2/FileLibrary/{FileLibraryId}
     */
    fileLibraryDetail = (fileLibraryId: string, params: RequestParams = {}) =>
        this.request<FileLibrary, string>({
            path: `/v2/FileLibrary/${fileLibraryId}`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags FileLibrary
     * @name FileLibraryDelete
     * @summary Deletes the !:FileLibraryId.LibraryName with FileLibraryId
     * @request DELETE:/v2/FileLibrary/{FileLibraryId}
     */
    fileLibraryDelete = (fileLibraryId: string, params: RequestParams = {}) =>
        this.request<void, string>({
            path: `/v2/FileLibrary/${fileLibraryId}`,
            method: 'DELETE',
            ...params,
        });
    /**
     * No description
     *
     * @tags FileLibrary
     * @name FileLibraryChangeBasePathPartialUpdate
     * @summary Changes the !:FileLibraryId.BasePath with FileLibraryId
     * @request PATCH:/v2/FileLibrary/{FileLibraryId}/ChangeBasePath
     */
    fileLibraryChangeBasePathPartialUpdate = (
        fileLibraryId: string,
        data: string,
        params: RequestParams = {}
    ) =>
        this.request<void, string>({
            path: `/v2/FileLibrary/${fileLibraryId}/ChangeBasePath`,
            method: 'PATCH',
            body: data,
            type: ContentType.Json,
            ...params,
        });
    /**
     * No description
     *
     * @tags FileLibrary
     * @name FileLibraryChangeNamePartialUpdate
     * @summary Changes the !:FileLibraryId.LibraryName with FileLibraryId
     * @request PATCH:/v2/FileLibrary/{FileLibraryId}/ChangeName
     */
    fileLibraryChangeNamePartialUpdate = (
        fileLibraryId: string,
        data: string,
        params: RequestParams = {}
    ) =>
        this.request<void, string>({
            path: `/v2/FileLibrary/${fileLibraryId}/ChangeName`,
            method: 'PATCH',
            body: data,
            type: ContentType.Json,
            ...params,
        });
    /**
     * No description
     *
     * @tags LibraryConnector
     * @name LibraryConnectorList
     * @summary Gets all configured API.Schema.LibraryContext.LibraryConnectors.LibraryConnector
     * @request GET:/v2/LibraryConnector
     */
    libraryConnectorList = (params: RequestParams = {}) =>
        this.request<LibraryConnector[], void>({
            path: `/v2/LibraryConnector`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags LibraryConnector
     * @name LibraryConnectorUpdate
     * @summary Creates a new API.Schema.LibraryContext.LibraryConnectors.LibraryConnector
     * @request PUT:/v2/LibraryConnector
     */
    libraryConnectorUpdate = (data: LibraryConnector, params: RequestParams = {}) =>
        this.request<string, string>({
            path: `/v2/LibraryConnector`,
            method: 'PUT',
            body: data,
            type: ContentType.Json,
            ...params,
        });
    /**
     * No description
     *
     * @tags LibraryConnector
     * @name LibraryConnectorDetail
     * @summary Returns API.Schema.LibraryContext.LibraryConnectors.LibraryConnector with LibraryConnectorId
     * @request GET:/v2/LibraryConnector/{LibraryConnectorId}
     */
    libraryConnectorDetail = (libraryConnectorId: string, params: RequestParams = {}) =>
        this.request<LibraryConnector, string>({
            path: `/v2/LibraryConnector/${libraryConnectorId}`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags LibraryConnector
     * @name LibraryConnectorDelete
     * @summary Deletes API.Schema.LibraryContext.LibraryConnectors.LibraryConnector with LibraryConnectorId
     * @request DELETE:/v2/LibraryConnector/{LibraryConnectorId}
     */
    libraryConnectorDelete = (libraryConnectorId: string, params: RequestParams = {}) =>
        this.request<void, string>({
            path: `/v2/LibraryConnector/${libraryConnectorId}`,
            method: 'DELETE',
            ...params,
        });
    /**
     * No description
     *
     * @tags Maintenance
     * @name MaintenanceCleanupNoDownloadMangaCreate
     * @summary Removes all API.Schema.MangaContext.Manga not marked for Download on any API.MangaConnectors.MangaConnector
     * @request POST:/v2/Maintenance/CleanupNoDownloadManga
     */
    maintenanceCleanupNoDownloadMangaCreate = (params: RequestParams = {}) =>
        this.request<void, string>({
            path: `/v2/Maintenance/CleanupNoDownloadManga`,
            method: 'POST',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaList
     * @summary Returns all cached API.Controllers.DTOs.Manga
     * @request GET:/v2/Manga
     */
    mangaList = (params: RequestParams = {}) =>
        this.request<MinimalManga[], void>({
            path: `/v2/Manga`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaKeysList
     * @summary Returns all cached API.Schema.MangaContext.Manga.Keys
     * @request GET:/v2/Manga/Keys
     */
    mangaKeysList = (params: RequestParams = {}) =>
        this.request<string[], void>({
            path: `/v2/Manga/Keys`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaDownloadingList
     * @summary Returns all API.Schema.MangaContext.Manga that are being downloaded from at least one API.MangaConnectors.MangaConnector
     * @request GET:/v2/Manga/Downloading
     */
    mangaDownloadingList = (params: RequestParams = {}) =>
        this.request<MinimalManga[], void>({
            path: `/v2/Manga/Downloading`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaWithIDsCreate
     * @summary Returns all cached API.Schema.MangaContext.Manga with MangaIds
     * @request POST:/v2/Manga/WithIDs
     */
    mangaWithIDsCreate = (data: string[], params: RequestParams = {}) =>
        this.request<Manga[], void>({
            path: `/v2/Manga/WithIDs`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaDetail
     * @summary Return API.Schema.MangaContext.Manga with MangaId
     * @request GET:/v2/Manga/{MangaId}
     */
    mangaDetail = (mangaId: string, params: RequestParams = {}) =>
        this.request<Manga, string>({
            path: `/v2/Manga/${mangaId}`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaDelete
     * @summary Delete API.Controllers.DTOs.Manga with MangaId
     * @request DELETE:/v2/Manga/{MangaId}
     */
    mangaDelete = (mangaId: string, params: RequestParams = {}) =>
        this.request<void, string>({ path: `/v2/Manga/${mangaId}`, method: 'DELETE', ...params });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaMergeIntoPartialUpdate
     * @summary Merge two API.Controllers.DTOs.Manga into one. THIS IS NOT REVERSIBLE!
     * @request PATCH:/v2/Manga/{MangaIdFrom}/MergeInto/{MangaIdInto}
     */
    mangaMergeIntoPartialUpdate = (
        mangaIdFrom: string,
        mangaIdInto: string,
        params: RequestParams = {}
    ) =>
        this.request<void, string>({
            path: `/v2/Manga/${mangaIdFrom}/MergeInto/${mangaIdInto}`,
            method: 'PATCH',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaCoverList
     * @summary Returns Cover of API.Controllers.DTOs.Manga with MangaId
     * @request GET:/v2/Manga/{MangaId}/Cover
     */
    mangaCoverList = (
        mangaId: string,
        query?: {
            /**
             * If width is provided, height needs to also be provided
             * @format int32
             */
            width?: number;
            /**
             * If height is provided, width needs to also be provided
             * @format int32
             */
            height?: number;
        },
        params: RequestParams = {}
    ) =>
        this.request<string, ProblemDetails | string | void>({
            path: `/v2/Manga/${mangaId}/Cover`,
            method: 'GET',
            query: query,
            format: 'blob',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaChaptersList
     * @summary Returns all API.Controllers.DTOs.Chapter of API.Controllers.DTOs.Manga with MangaId
     * @request GET:/v2/Manga/{MangaId}/Chapters
     */
    mangaChaptersList = (mangaId: string, params: RequestParams = {}) =>
        this.request<Chapter[], ProblemDetails>({
            path: `/v2/Manga/${mangaId}/Chapters`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaChaptersDownloadedList
     * @summary Returns all downloaded API.Controllers.DTOs.Chapter for API.Controllers.DTOs.Manga with MangaId
     * @request GET:/v2/Manga/{MangaId}/Chapters/Downloaded
     */
    mangaChaptersDownloadedList = (mangaId: string, params: RequestParams = {}) =>
        this.request<Chapter[], string>({
            path: `/v2/Manga/${mangaId}/Chapters/Downloaded`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaChaptersNotDownloadedList
     * @summary Returns all API.Controllers.DTOs.Chapter not downloaded for API.Controllers.DTOs.Manga with MangaId
     * @request GET:/v2/Manga/{MangaId}/Chapters/NotDownloaded
     */
    mangaChaptersNotDownloadedList = (mangaId: string, params: RequestParams = {}) =>
        this.request<Chapter[], string>({
            path: `/v2/Manga/${mangaId}/Chapters/NotDownloaded`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaChapterLatestAvailableList
     * @summary Returns the latest API.Controllers.DTOs.Chapter of requested API.Controllers.DTOs.Manga available on API.MangaConnectors.MangaConnector
     * @request GET:/v2/Manga/{MangaId}/Chapter/LatestAvailable
     */
    mangaChapterLatestAvailableList = (mangaId: string, params: RequestParams = {}) =>
        this.request<number, string | void>({
            path: `/v2/Manga/${mangaId}/Chapter/LatestAvailable`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaChapterLatestDownloadedList
     * @summary Returns the latest API.Controllers.DTOs.Chapter of requested API.Controllers.DTOs.Manga that is downloaded
     * @request GET:/v2/Manga/{MangaId}/Chapter/LatestDownloaded
     */
    mangaChapterLatestDownloadedList = (mangaId: string, params: RequestParams = {}) =>
        this.request<Chapter, string | ProblemDetails | void>({
            path: `/v2/Manga/${mangaId}/Chapter/LatestDownloaded`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaIgnoreChaptersBeforePartialUpdate
     * @summary Configure the API.Controllers.DTOs.Chapter cut-off for API.Controllers.DTOs.Manga
     * @request PATCH:/v2/Manga/{MangaId}/IgnoreChaptersBefore
     */
    mangaIgnoreChaptersBeforePartialUpdate = (
        mangaId: string,
        data: number,
        params: RequestParams = {}
    ) =>
        this.request<void, string>({
            path: `/v2/Manga/${mangaId}/IgnoreChaptersBefore`,
            method: 'PATCH',
            body: data,
            type: ContentType.Json,
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaChangeLibraryCreate
     * @summary Move API.Controllers.DTOs.Manga to different API.Schema.MangaContext.FileLibrary
     * @request POST:/v2/Manga/{MangaId}/ChangeLibrary/{LibraryId}
     */
    mangaChangeLibraryCreate = (mangaId: string, libraryId: string, params: RequestParams = {}) =>
        this.request<void, string>({
            path: `/v2/Manga/${mangaId}/ChangeLibrary/${libraryId}`,
            method: 'POST',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaSetAsDownloadFromCreate
     * @summary (Un-)Marks API.Controllers.DTOs.Manga as requested for Download from API.MangaConnectors.MangaConnector
     * @request POST:/v2/Manga/{MangaId}/SetAsDownloadFrom/{MangaConnectorName}/{IsRequested}
     */
    mangaSetAsDownloadFromCreate = (
        mangaId: string,
        mangaConnectorName: string,
        isRequested: boolean,
        params: RequestParams = {}
    ) =>
        this.request<void, string>({
            path: `/v2/Manga/${mangaId}/SetAsDownloadFrom/${mangaConnectorName}/${isRequested}`,
            method: 'POST',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaSearchOnCreate
     * @summary Initiate a search for API.Schema.MangaContext.Manga on a different API.MangaConnectors.MangaConnector
     * @request POST:/v2/Manga/{MangaId}/SearchOn/{MangaConnectorName}
     */
    mangaSearchOnCreate = (
        mangaId: string,
        mangaConnectorName: string,
        params: RequestParams = {}
    ) =>
        this.request<MinimalManga[], string | ProblemDetails | void>({
            path: `/v2/Manga/${mangaId}/SearchOn/${mangaConnectorName}`,
            method: 'POST',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaWithAuthorIdDetail
     * @summary Returns all API.Controllers.DTOs.Manga which where Authored by API.Controllers.DTOs.Author with AuthorId
     * @request GET:/v2/Manga/WithAuthorId/{AuthorId}
     */
    mangaWithAuthorIdDetail = (authorId: string, params: RequestParams = {}) =>
        this.request<Manga[], string | void>({
            path: `/v2/Manga/WithAuthorId/${authorId}`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Manga
     * @name MangaWithTagDetail
     * @summary Returns all API.Controllers.DTOs.Manga with !:Tag
     * @request GET:/v2/Manga/WithTag/{Tag}
     */
    mangaWithTagDetail = (tag: string, params: RequestParams = {}) =>
        this.request<Manga[], string | void>({
            path: `/v2/Manga/WithTag/${tag}`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags MangaConnector
     * @name MangaConnectorList
     * @summary Get all API.MangaConnectors.MangaConnector (Scanlation-Sites)
     * @request GET:/v2/MangaConnector
     */
    mangaConnectorList = (params: RequestParams = {}) =>
        this.request<MangaConnector[], any>({
            path: `/v2/MangaConnector`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags MangaConnector
     * @name MangaConnectorDetail
     * @summary Returns the API.MangaConnectors.MangaConnector (Scanlation-Sites) with the requested Name
     * @request GET:/v2/MangaConnector/{MangaConnectorName}
     */
    mangaConnectorDetail = (mangaConnectorName: string, params: RequestParams = {}) =>
        this.request<MangaConnector, string>({
            path: `/v2/MangaConnector/${mangaConnectorName}`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags MangaConnector
     * @name MangaConnectorEnabledList
     * @summary Get all enabled API.MangaConnectors.MangaConnector (Scanlation-Sites)
     * @request GET:/v2/MangaConnector/Enabled
     */
    mangaConnectorEnabledList = (params: RequestParams = {}) =>
        this.request<MangaConnector[], any>({
            path: `/v2/MangaConnector/Enabled`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags MangaConnector
     * @name MangaConnectorDisabledList
     * @summary Get all disabled API.MangaConnectors.MangaConnector (Scanlation-Sites)
     * @request GET:/v2/MangaConnector/Disabled
     */
    mangaConnectorDisabledList = (params: RequestParams = {}) =>
        this.request<MangaConnector[], any>({
            path: `/v2/MangaConnector/Disabled`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags MangaConnector
     * @name MangaConnectorSetEnabledPartialUpdate
     * @summary Enabled or disables API.MangaConnectors.MangaConnector (Scanlation-Sites) with Name
     * @request PATCH:/v2/MangaConnector/{MangaConnectorName}/SetEnabled/{Enabled}
     */
    mangaConnectorSetEnabledPartialUpdate = (
        mangaConnectorName: string,
        enabled: boolean,
        params: RequestParams = {}
    ) =>
        this.request<void, string>({
            path: `/v2/MangaConnector/${mangaConnectorName}/SetEnabled/${enabled}`,
            method: 'PATCH',
            ...params,
        });
    /**
     * No description
     *
     * @tags MetadataFetcher
     * @name MetadataFetcherList
     * @summary Get all API.Schema.MangaContext.MetadataFetchers.MetadataFetcher (Metadata-Sites)
     * @request GET:/v2/MetadataFetcher
     */
    metadataFetcherList = (params: RequestParams = {}) =>
        this.request<string[], any>({
            path: `/v2/MetadataFetcher`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags MetadataFetcher
     * @name MetadataFetcherLinksList
     * @summary Returns all API.Schema.MangaContext.MetadataFetchers.MetadataEntry
     * @request GET:/v2/MetadataFetcher/Links
     */
    metadataFetcherLinksList = (params: RequestParams = {}) =>
        this.request<MetadataEntry[], void>({
            path: `/v2/MetadataFetcher/Links`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags MetadataFetcher
     * @name MetadataFetcherSearchMangaCreate
     * @summary Searches API.Schema.MangaContext.MetadataFetchers.MetadataFetcher (Metadata-Sites) for Manga-Metadata
     * @request POST:/v2/MetadataFetcher/{MetadataFetcherName}/SearchManga/{MangaId}
     */
    metadataFetcherSearchMangaCreate = (
        mangaId: string,
        metadataFetcherName: string,
        data: string,
        params: RequestParams = {}
    ) =>
        this.request<MetadataSearchResult[], ProblemDetails | string>({
            path: `/v2/MetadataFetcher/${metadataFetcherName}/SearchManga/${mangaId}`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags MetadataFetcher
     * @name MetadataFetcherLinkCreate
     * @summary Links API.Schema.MangaContext.MetadataFetchers.MetadataFetcher (Metadata-Sites) using Provider-Specific Identifier to API.Schema.MangaContext.Manga
     * @request POST:/v2/MetadataFetcher/{MetadataFetcherName}/Link/{MangaId}
     */
    metadataFetcherLinkCreate = (
        mangaId: string,
        metadataFetcherName: string,
        data: string,
        params: RequestParams = {}
    ) =>
        this.request<MetadataEntry, ProblemDetails | string>({
            path: `/v2/MetadataFetcher/${metadataFetcherName}/Link/${mangaId}`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags MetadataFetcher
     * @name MetadataFetcherUnlinkCreate
     * @summary Un-Links API.Schema.MangaContext.MetadataFetchers.MetadataFetcher (Metadata-Sites) from API.Schema.MangaContext.Manga
     * @request POST:/v2/MetadataFetcher/{MetadataFetcherName}/Unlink/{MangaId}
     */
    metadataFetcherUnlinkCreate = (
        mangaId: string,
        metadataFetcherName: string,
        params: RequestParams = {}
    ) =>
        this.request<void, ProblemDetails | string>({
            path: `/v2/MetadataFetcher/${metadataFetcherName}/Unlink/${mangaId}`,
            method: 'POST',
            ...params,
        });
    /**
     * No description
     *
     * @tags NotificationConnector
     * @name NotificationConnectorList
     * @summary Gets all configured API.Schema.NotificationsContext.NotificationConnectors.NotificationConnector
     * @request GET:/v2/NotificationConnector
     */
    notificationConnectorList = (params: RequestParams = {}) =>
        this.request<NotificationConnector[], void>({
            path: `/v2/NotificationConnector`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * @description Formatting placeholders: "%title" and "%text" can be placed in url, header-values and body and will be replaced when notifications are sent
     *
     * @tags NotificationConnector
     * @name NotificationConnectorUpdate
     * @summary Creates a new API.Schema.NotificationsContext.NotificationConnectors.NotificationConnector
     * @request PUT:/v2/NotificationConnector
     */
    notificationConnectorUpdate = (data: NotificationConnector, params: RequestParams = {}) =>
        this.request<string, string>({
            path: `/v2/NotificationConnector`,
            method: 'PUT',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags NotificationConnector
     * @name NotificationConnectorDetail
     * @summary Returns API.Schema.NotificationsContext.NotificationConnectors.NotificationConnector with requested Name
     * @request GET:/v2/NotificationConnector/{Name}
     */
    notificationConnectorDetail = (name: string, params: RequestParams = {}) =>
        this.request<NotificationConnector, string>({
            path: `/v2/NotificationConnector/${name}`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags NotificationConnector
     * @name NotificationConnectorDelete
     * @summary Deletes the API.Schema.NotificationsContext.NotificationConnectors.NotificationConnector with the requested Name
     * @request DELETE:/v2/NotificationConnector/{Name}
     */
    notificationConnectorDelete = (name: string, params: RequestParams = {}) =>
        this.request<void, string>({
            path: `/v2/NotificationConnector/${name}`,
            method: 'DELETE',
            ...params,
        });
    /**
     * @description Priority needs to be between 0 and 10
     *
     * @tags NotificationConnector
     * @name NotificationConnectorGotifyUpdate
     * @summary Creates a new Gotify-API.Schema.NotificationsContext.NotificationConnectors.NotificationConnector
     * @request PUT:/v2/NotificationConnector/Gotify
     */
    notificationConnectorGotifyUpdate = (data: GotifyRecord, params: RequestParams = {}) =>
        this.request<string, string>({
            path: `/v2/NotificationConnector/Gotify`,
            method: 'PUT',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
    /**
     * @description Priority needs to be between 1 and 5
     *
     * @tags NotificationConnector
     * @name NotificationConnectorNtfyUpdate
     * @summary Creates a new Ntfy-API.Schema.NotificationsContext.NotificationConnectors.NotificationConnector
     * @request PUT:/v2/NotificationConnector/Ntfy
     */
    notificationConnectorNtfyUpdate = (data: NtfyRecord, params: RequestParams = {}) =>
        this.request<string, string>({
            path: `/v2/NotificationConnector/Ntfy`,
            method: 'PUT',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
    /**
     * @description https://pushover.net/api
     *
     * @tags NotificationConnector
     * @name NotificationConnectorPushoverUpdate
     * @summary Creates a new Pushover-API.Schema.NotificationsContext.NotificationConnectors.NotificationConnector
     * @request PUT:/v2/NotificationConnector/Pushover
     */
    notificationConnectorPushoverUpdate = (data: PushoverRecord, params: RequestParams = {}) =>
        this.request<string, string>({
            path: `/v2/NotificationConnector/Pushover`,
            method: 'PUT',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Query
     * @name QueryAuthorDetail
     * @summary Returns the API.Controllers.DTOs.Author with AuthorId
     * @request GET:/v2/Query/Author/{AuthorId}
     */
    queryAuthorDetail = (authorId: string, params: RequestParams = {}) =>
        this.request<Author, string>({
            path: `/v2/Query/Author/${authorId}`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Query
     * @name QueryChapterDetail
     * @summary Returns API.Controllers.DTOs.Chapter with ChapterId
     * @request GET:/v2/Query/Chapter/{ChapterId}
     */
    queryChapterDetail = (chapterId: string, params: RequestParams = {}) =>
        this.request<Chapter, string>({
            path: `/v2/Query/Chapter/${chapterId}`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Query
     * @name QueryMangaMangaConnectorIdDetail
     * @summary Returns the API.Schema.MangaContext.MangaConnectorId`1 with API.Schema.MangaContext.MangaConnectorId`1.Key
     * @request GET:/v2/Query/Manga/MangaConnectorId/{MangaConnectorIdId}
     */
    queryMangaMangaConnectorIdDetail = (mangaConnectorIdId: string, params: RequestParams = {}) =>
        this.request<MangaConnectorId, string>({
            path: `/v2/Query/Manga/MangaConnectorId/${mangaConnectorIdId}`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Query
     * @name QueryMangaSimilarNameList
     * @summary Returns API.Schema.MangaContext.Manga with names similar to API.Schema.MangaContext.Manga (identified by MangaId)
     * @request GET:/v2/Query/Manga/{MangaId}/SimilarName
     */
    queryMangaSimilarNameList = (mangaId: string, params: RequestParams = {}) =>
        this.request<string[], string | void>({
            path: `/v2/Query/Manga/${mangaId}/SimilarName`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Query
     * @name QueryChapterMangaConnectorIdDetail
     * @summary Returns the API.Schema.MangaContext.MangaConnectorId`1 with API.Schema.MangaContext.MangaConnectorId`1.Key
     * @request GET:/v2/Query/Chapter/MangaConnectorId/{MangaConnectorIdId}
     */
    queryChapterMangaConnectorIdDetail = (mangaConnectorIdId: string, params: RequestParams = {}) =>
        this.request<MangaConnectorId, string>({
            path: `/v2/Query/Chapter/MangaConnectorId/${mangaConnectorIdId}`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Search
     * @name SearchDetail
     * @summary Initiate a search for a API.Schema.MangaContext.Manga on API.Controllers.DTOs.MangaConnector with searchTerm
     * @request GET:/v2/Search/{MangaConnectorName}/{Query}
     */
    searchDetail = (mangaConnectorName: string, query: string, params: RequestParams = {}) =>
        this.request<MinimalManga[], string | ProblemDetails | void>({
            path: `/v2/Search/${mangaConnectorName}/${query}`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Search
     * @name SearchUrlCreate
     * @summary Returns API.Schema.MangaContext.Manga from the API.Controllers.DTOs.MangaConnector associated with url
     * @request POST:/v2/Search/Url
     */
    searchUrlCreate = (data: string, params: RequestParams = {}) =>
        this.request<MinimalManga, string>({
            path: `/v2/Search/Url`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsList
     * @summary Get all API.Tranga.Settings
     * @request GET:/v2/Settings
     */
    settingsList = (params: RequestParams = {}) =>
        this.request<TrangaSettings, any>({
            path: `/v2/Settings`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsUserAgentList
     * @summary Get the current UserAgent used by Tranga
     * @request GET:/v2/Settings/UserAgent
     */
    settingsUserAgentList = (params: RequestParams = {}) =>
        this.request<string, any>({ path: `/v2/Settings/UserAgent`, method: 'GET', ...params });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsUserAgentPartialUpdate
     * @summary Set a new UserAgent
     * @request PATCH:/v2/Settings/UserAgent
     */
    settingsUserAgentPartialUpdate = (data: string, params: RequestParams = {}) =>
        this.request<void, any>({
            path: `/v2/Settings/UserAgent`,
            method: 'PATCH',
            body: data,
            type: ContentType.Json,
            ...params,
        });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsUserAgentDelete
     * @summary Reset the UserAgent to default
     * @request DELETE:/v2/Settings/UserAgent
     */
    settingsUserAgentDelete = (params: RequestParams = {}) =>
        this.request<void, any>({ path: `/v2/Settings/UserAgent`, method: 'DELETE', ...params });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsRequestLimitsList
     * @summary Get all Request-Limits
     * @request GET:/v2/Settings/RequestLimits
     */
    settingsRequestLimitsList = (params: RequestParams = {}) =>
        this.request<
            {
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
            },
            any
        >({ path: `/v2/Settings/RequestLimits`, method: 'GET', format: 'json', ...params });
    /**
     * @description <h1>NOT IMPLEMENTED</h1>
     *
     * @tags Settings
     * @name SettingsRequestLimitsPartialUpdate
     * @summary Update all Request-Limits to new values
     * @request PATCH:/v2/Settings/RequestLimits
     */
    settingsRequestLimitsPartialUpdate = (params: RequestParams = {}) =>
        this.request<any, void>({ path: `/v2/Settings/RequestLimits`, method: 'PATCH', ...params });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsRequestLimitsDelete
     * @summary Reset Request-Limit
     * @request DELETE:/v2/Settings/RequestLimits
     */
    settingsRequestLimitsDelete = (params: RequestParams = {}) =>
        this.request<string, any>({
            path: `/v2/Settings/RequestLimits`,
            method: 'DELETE',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsRequestLimitsPartialUpdate2
     * @summary Updates a Request-Limit value
     * @request PATCH:/v2/Settings/RequestLimits/{RequestType}
     * @originalName settingsRequestLimitsPartialUpdate
     * @duplicate
     */
    settingsRequestLimitsPartialUpdate2 = (
        requestType: RequestType,
        data: number,
        params: RequestParams = {}
    ) =>
        this.request<void, ProblemDetails>({
            path: `/v2/Settings/RequestLimits/${requestType}`,
            method: 'PATCH',
            body: data,
            type: ContentType.Json,
            ...params,
        });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsRequestLimitsDelete2
     * @summary Reset Request-Limit
     * @request DELETE:/v2/Settings/RequestLimits/{RequestType}
     * @originalName settingsRequestLimitsDelete
     * @duplicate
     */
    settingsRequestLimitsDelete2 = (requestType: RequestType, params: RequestParams = {}) =>
        this.request<string, any>({
            path: `/v2/Settings/RequestLimits/${requestType}`,
            method: 'DELETE',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsImageCompressionLevelList
     * @summary Returns Level of Image-Compression for Images
     * @request GET:/v2/Settings/ImageCompressionLevel
     */
    settingsImageCompressionLevelList = (params: RequestParams = {}) =>
        this.request<number, any>({
            path: `/v2/Settings/ImageCompressionLevel`,
            method: 'GET',
            ...params,
        });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsImageCompressionLevelPartialUpdate
     * @summary Set the Image-Compression-Level for Images
     * @request PATCH:/v2/Settings/ImageCompressionLevel/{level}
     */
    settingsImageCompressionLevelPartialUpdate = (level: number, params: RequestParams = {}) =>
        this.request<void, ProblemDetails>({
            path: `/v2/Settings/ImageCompressionLevel/${level}`,
            method: 'PATCH',
            ...params,
        });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsBwImagesList
     * @summary Get state of Black/White-Image setting
     * @request GET:/v2/Settings/BWImages
     */
    settingsBwImagesList = (params: RequestParams = {}) =>
        this.request<boolean, any>({ path: `/v2/Settings/BWImages`, method: 'GET', ...params });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsBwImagesPartialUpdate
     * @summary Enable/Disable conversion of Images to Black and White
     * @request PATCH:/v2/Settings/BWImages/{enabled}
     */
    settingsBwImagesPartialUpdate = (enabled: boolean, params: RequestParams = {}) =>
        this.request<void, any>({
            path: `/v2/Settings/BWImages/${enabled}`,
            method: 'PATCH',
            ...params,
        });
    /**
     * @description Placeholders: %M Obj Name %V Volume %C Chapter %T Title %A Author (first in list) %I Chapter Internal ID %i Obj Internal ID %Y Year (Obj) ?_(...) replace _ with a value from above: Everything inside the braces will only be added if the value of %_ is not null
     *
     * @tags Settings
     * @name SettingsChapterNamingSchemeList
     * @summary Gets the Chapter Naming Scheme
     * @request GET:/v2/Settings/ChapterNamingScheme
     */
    settingsChapterNamingSchemeList = (params: RequestParams = {}) =>
        this.request<string, any>({
            path: `/v2/Settings/ChapterNamingScheme`,
            method: 'GET',
            ...params,
        });
    /**
     * @description Placeholders: %M Obj Name %V Volume %C Chapter %T Title %A Author (first in list) %Y Year (Obj) ?_(...) replace _ with a value from above: Everything inside the braces will only be added if the value of %_ is not null
     *
     * @tags Settings
     * @name SettingsChapterNamingSchemePartialUpdate
     * @summary Sets the Chapter Naming Scheme
     * @request PATCH:/v2/Settings/ChapterNamingScheme
     */
    settingsChapterNamingSchemePartialUpdate = (data: string, params: RequestParams = {}) =>
        this.request<void, any>({
            path: `/v2/Settings/ChapterNamingScheme`,
            method: 'PATCH',
            body: data,
            type: ContentType.Json,
            ...params,
        });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsFlareSolverrUrlCreate
     * @summary Sets the FlareSolverr-URL
     * @request POST:/v2/Settings/FlareSolverr/Url
     */
    settingsFlareSolverrUrlCreate = (data: string, params: RequestParams = {}) =>
        this.request<void, any>({
            path: `/v2/Settings/FlareSolverr/Url`,
            method: 'POST',
            body: data,
            type: ContentType.Json,
            ...params,
        });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsFlareSolverrUrlDelete
     * @summary Resets the FlareSolverr-URL (HttpClient does not use FlareSolverr anymore)
     * @request DELETE:/v2/Settings/FlareSolverr/Url
     */
    settingsFlareSolverrUrlDelete = (params: RequestParams = {}) =>
        this.request<void, any>({
            path: `/v2/Settings/FlareSolverr/Url`,
            method: 'DELETE',
            ...params,
        });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsFlareSolverrTestCreate
     * @summary Test FlareSolverr
     * @request POST:/v2/Settings/FlareSolverr/Test
     */
    settingsFlareSolverrTestCreate = (params: RequestParams = {}) =>
        this.request<void, void>({
            path: `/v2/Settings/FlareSolverr/Test`,
            method: 'POST',
            ...params,
        });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsDownloadLanguageList
     * @summary Returns the language in which Manga are downloaded
     * @request GET:/v2/Settings/DownloadLanguage
     */
    settingsDownloadLanguageList = (params: RequestParams = {}) =>
        this.request<string, any>({
            path: `/v2/Settings/DownloadLanguage`,
            method: 'GET',
            ...params,
        });
    /**
     * No description
     *
     * @tags Settings
     * @name SettingsDownloadLanguagePartialUpdate
     * @summary Sets the language in which Manga are downloaded
     * @request PATCH:/v2/Settings/DownloadLanguage/{Language}
     */
    settingsDownloadLanguagePartialUpdate = (language: string, params: RequestParams = {}) =>
        this.request<void, any>({
            path: `/v2/Settings/DownloadLanguage/${language}`,
            method: 'PATCH',
            ...params,
        });
    /**
     * No description
     *
     * @tags Worker
     * @name WorkerList
     * @summary Returns all API.Workers.BaseWorker
     * @request GET:/v2/Worker
     */
    workerList = (params: RequestParams = {}) =>
        this.request<Worker[], any>({
            path: `/v2/Worker`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Worker
     * @name WorkerKeysList
     * @summary Returns all API.Workers.BaseWorker.Keys
     * @request GET:/v2/Worker/Keys
     */
    workerKeysList = (params: RequestParams = {}) =>
        this.request<string[], any>({
            path: `/v2/Worker/Keys`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Worker
     * @name WorkerStateDetail
     * @summary Get all API.Workers.BaseWorker in requested API.Workers.WorkerExecutionState
     * @request GET:/v2/Worker/State/{State}
     */
    workerStateDetail = (state: WorkerExecutionState, params: RequestParams = {}) =>
        this.request<Worker[], any>({
            path: `/v2/Worker/State/${state}`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Worker
     * @name WorkerDetail
     * @summary Return API.Workers.BaseWorker with WorkerId
     * @request GET:/v2/Worker/{WorkerId}
     */
    workerDetail = (workerId: string, params: RequestParams = {}) =>
        this.request<Worker, string>({
            path: `/v2/Worker/${workerId}`,
            method: 'GET',
            format: 'json',
            ...params,
        });
    /**
     * No description
     *
     * @tags Worker
     * @name WorkerDelete
     * @summary Delete API.Workers.BaseWorker with WorkerId and all child-API.Workers.BaseWorkers
     * @request DELETE:/v2/Worker/{WorkerId}
     */
    workerDelete = (workerId: string, params: RequestParams = {}) =>
        this.request<void, string>({ path: `/v2/Worker/${workerId}`, method: 'DELETE', ...params });
    /**
     * No description
     *
     * @tags Worker
     * @name WorkerStartCreate
     * @summary Starts API.Workers.BaseWorker with WorkerId
     * @request POST:/v2/Worker/{WorkerId}/Start
     */
    workerStartCreate = (workerId: string, params: RequestParams = {}) =>
        this.request<void, string | ProblemDetails>({
            path: `/v2/Worker/${workerId}/Start`,
            method: 'POST',
            ...params,
        });
    /**
     * No description
     *
     * @tags Worker
     * @name WorkerStopCreate
     * @summary Stops API.Workers.BaseWorker with WorkerId
     * @request POST:/v2/Worker/{WorkerId}/Stop
     */
    workerStopCreate = (workerId: string, params: RequestParams = {}) =>
        this.request<void, string | ProblemDetails>({
            path: `/v2/Worker/${workerId}/Stop`,
            method: 'POST',
            ...params,
        });
}
