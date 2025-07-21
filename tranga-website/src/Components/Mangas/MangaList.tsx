import {useContext, useState} from "react";
import {ApiContext} from "../../apiClient/ApiContext.tsx";
import {MangaCardFromId} from "./MangaCard.tsx";
import {Stack} from "@mui/joy";
import "./MangaList.css";

export default function MangaList (){
    const Api = useContext(ApiContext);
    
    const [mangaIds, setMangaIds] = useState<string[]>();

    Api.mangaList().then((response) => {
        if (!response.ok)
            return;
        setMangaIds(response.data);
    });
    
    return (
        <Stack className={"manga-list"} direction={"row"} useFlexGap={true} spacing={2} flexWrap={"wrap"}>
            {mangaIds?.map(id => <MangaCardFromId key={id} mangaId={id} />)}
        </Stack>
    );
    
}