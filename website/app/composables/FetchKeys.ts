import type { components } from '#open-fetch-schemas/api';
type ActionsFilterRecord = components['schemas']['ActionsFilterRecord'];

export const FetchKeys = {
    FileLibraries: 'FileLibraries',
    Chapters: { All: 'Chapters' },
    Manga: { All: 'Manga', Id: (id: string) => `Manga/${id}` },
    MangaConnector: { Id: (id: string) => `MangaConnector/${id}`, All: 'MangaConnector' },
    Metadata: { Fetchers: 'Metadata', Links: 'Metadata/Links', Manga: (mangaId: string) => `Metadata/Links/${mangaId}` },
    Libraries: { All: 'Libraries', Id: (id: string) => `Libraries/${id}` },
    Settings: { All: 'Settings' },
    Actions: { Types: 'Actions/Types', Page: (filter: ActionsFilterRecord, page: number) => `Actions/${JSON.stringify(filter)}/${page}` },
    NotificationConnectors: { All: 'All' },
};
