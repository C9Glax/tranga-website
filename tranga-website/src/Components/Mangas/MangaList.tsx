import {useContext} from "react";
import {MangaCard} from "./MangaCard.tsx";
import {Stack} from "@mui/joy";
import "./MangaList.css";
import {MangaContext} from "../../App.tsx";

export default function MangaList (){
    const mangas = useContext(MangaContext);
    
    return (
        <Stack className={"manga-list"} direction={"row"} useFlexGap={true} spacing={2} flexWrap={"wrap"}>
            {mangas?.map(manga => <MangaCard key={manga.key} manga={manga} />)}
        </Stack>
    );
    
}