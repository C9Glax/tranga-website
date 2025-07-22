import {ReactNode, useContext, useEffect, useState} from "react";
import {Manga} from "../../apiClient/data-contracts.ts";
import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";
import {ApiContext} from "../../apiClient/ApiContext.tsx";
import {MangaCard} from "./MangaCard.tsx";
import {Button} from "@mui/joy";

export default function ({manga} : {manga : Manga | undefined}) : ReactNode {
    const Api = useContext(ApiContext);
    
    const [similar, setSimilar] = useState<Manga[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    
    useEffect(()=> {
        if (manga === undefined || !open)
            return;
        Api.queryMangaSimilarNameList(manga.key as string).then(response => {
            if (response.ok)
                Api.mangaWithIDsCreate(response.data).then(response => {
                   if (response.ok)
                       setSimilar(response.data);
                });
        });
    }, [open]);
    
    return (
        <>
            <Button onClick={_ => setOpen(true)}>
                Merge
            </Button>
            <Drawer open={open} onClose={() => setOpen(false)} anchor={"bottom"}>
                <ModalClose />
                {similar.map(manga => <MangaCard manga={manga}></MangaCard>)}
            </Drawer>
        </>
    );
}