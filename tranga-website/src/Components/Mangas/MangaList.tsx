import {ReactNode} from "react";
import {MangaCard} from "./MangaCard.tsx";
import {Stack} from "@mui/joy";
import "./MangaList.css";
import {Manga} from "../../apiClient/data-contracts.ts";

export default function MangaList ({mangas, children} : {mangas: Manga[], children?: ReactNode}) {
   
    return (
        <Stack className={"manga-list"} direction={"row"} useFlexGap={true} spacing={2} flexWrap={"wrap"}>
            {children}
            {mangas?.map(manga => <MangaCard key={manga.key} manga={manga} />)}
        </Stack>
    );
    
}