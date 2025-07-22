import {ReactNode, useContext, useEffect, useState} from "react";
import {Manga} from "../../apiClient/data-contracts.ts";
import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";
import {ApiContext} from "../../apiClient/ApiContext.tsx";
import {MangaCard} from "./MangaCard.tsx";
import {Button, Modal, ModalDialog, Stack, Tooltip, Typography} from "@mui/joy";
import {KeyboardDoubleArrowRight, Warning} from "@mui/icons-material";
import {LoadingState, StateIndicator} from "../Loading.tsx";

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
            <Drawer size={"lg"} open={open} onClose={() => setOpen(false)} anchor={"bottom"}>
                <ModalClose />
                <Stack direction={"row"} spacing={2} flexWrap={"wrap"} useFlexGap>
                    {similar.map(similarManga => <MangaCard manga={similarManga}>
                        <ConfirmationModal manga={manga as Manga} similarManga={similarManga} />
                    </MangaCard>)}
                </Stack>
            </Drawer>
        </>
    );
}

function ConfirmationModal({manga, similarManga} : {manga : Manga, similarManga : Manga}) : ReactNode {
    const [open, setOpen] = useState<boolean>(false);
    const Api = useContext(ApiContext);

    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.none);
    
    const merge = () => {
        setLoadingState(LoadingState.loading);
        Api.mangaMergeIntoPartialUpdate(manga.key as string, similarManga.key as string).then(response => {
            if (response.ok){
                setLoadingState(LoadingState.success);
                setTimeout(() => setOpen(false), 2000);
            }else
                setLoadingState(LoadingState.failure);
        }).catch(_ => setLoadingState(LoadingState.failure));
    }
    
    return (
        <>
            <Button onClick={_ => setOpen(true)}>
                Merge into
            </Button>
            <Modal open={open} onClose={_ => setOpen(false)}>
                <ModalDialog>
                    <ModalClose />
                    <Typography level={"h2"}>Confirm Merge</Typography>
                    <Stack direction={"row"} spacing={3} alignItems={"center"}>
                        <MangaCard manga={manga} />
                        <Typography color={"danger"} level={"h1"}><KeyboardDoubleArrowRight /></Typography>
                        <MangaCard manga={similarManga} />
                    </Stack>
                    <Tooltip title={"THIS CAN NOT BE UNDONE!"}>
                        <Button
                            onClick={merge}
                            disabled={loadingState === LoadingState.loading}
                            endDecorator={StateIndicator(loadingState)}
                            color={"danger"}
                            startDecorator={<Warning />}>
                            Merge
                        </Button>
                    </Tooltip>
                </ModalDialog>
            </Modal>
        </>
    );
}