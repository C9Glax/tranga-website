import {ReactNode} from "react";
import {MangaCard} from "./MangaCard.tsx";
import {Stack} from "@mui/joy";
import "./MangaList.css";
import {Manga} from "../../apiClient/data-contracts.ts";
import MangaDownloadDialog from "./MangaDownloadDialog.tsx";
import MangaMerge from "./MangaMerge.tsx";

export default function MangaList ({mangas, children} : {mangas: Manga[], children?: ReactNode}) {
   
    return (
        <Stack className={"manga-list"} direction={"row"} useFlexGap={true} spacing={2} flexWrap={"wrap"} sx={
            {
                mx: 'calc(-1 * var(--ModalDialog-padding))',
                px: 'var(--ModalDialog-padding)',
                overflowY: 'scroll'
            }}>
            {children}
            {mangas?.map(manga => (
                <MangaCard key={manga.key} manga={manga}>
                    <MangaDownloadDialog manga={manga} />
                    <MangaMerge manga={manga} />
                </MangaCard>
            ))}
        </Stack>
    );
    
}