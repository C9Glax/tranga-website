export const FetchKeys = {
    FileLibraries: 'FileLibraries',
    Chapters: { All: 'Chapters' },
    Manga: { All: 'Manga', Id: (id: string) => `Manga/${id}` },
    MangaConnector: { Id: (id: string) => `MangaConnector/${id}`, All: 'MangaConnector' },
};
