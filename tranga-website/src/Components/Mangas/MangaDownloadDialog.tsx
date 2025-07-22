import {Manga} from "../../apiClient/data-contracts.ts";
import {ChangeEvent, Dispatch, ReactNode, useContext, useEffect, useState} from "react";
import {Button, Checkbox, Option, Select, Stack, Typography} from "@mui/joy";
import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";
import {MangaConnectorLinkFromId} from "../MangaConnectorLink.tsx";
import Sheet from "@mui/joy/Sheet";
import {FileLibraryContext} from "../../App.tsx";
import {ApiContext} from "../../apiClient/ApiContext.tsx";
import {LoadingState, StateIndicator} from "../Loading.tsx";

export default function ({manga} : {manga: Manga}) : ReactNode{
    const [open, setOpen] = useState(false);
    
    return (
        <>
            <Button onClick={() => setOpen(true)}>Download</Button>
            <DownloadDrawer manga={manga} open={open} setOpen={setOpen} />
        </>
    );
}

function DownloadDrawer({manga, open, setOpen}: {manga: Manga, open: boolean, setOpen: Dispatch<boolean>}): ReactNode  {
    const fileLibraries = useContext(FileLibraryContext);
    const Api = useContext(ApiContext);
    
    const onLibraryChange = (_ :any, value: ({} | null)) => {
        if (value === undefined)
            return;
        Api.mangaChangeLibraryCreate(manga.key as string, value as string);
    }
    
    return (
        <Drawer open={open} onClose={() => setOpen(false)}>
            <ModalClose />
            <Sheet sx={{width: "calc(95% - 60px)", margin: "30px"}}>
                <Typography>Download to Library:</Typography>
                <Select placeholder={"Library"} onChange={onLibraryChange} value={manga.libraryId}>
                    {fileLibraries?.map(library => (
                        <Option value={library.key} key={library.key}><Typography>{library.libraryName}</Typography> <Typography>({library.basePath})</Typography></Option>
                    ))}
                </Select>
                <Typography>Download from:</Typography>
                <Stack>
                    {manga.mangaConnectorIdsIds?.map(id => <DownloadCheckBox key={id} mangaConnectorIdId={id} />)}
                </Stack>
            </Sheet>
        </Drawer>
    );
}

function DownloadCheckBox({mangaConnectorIdId} : {mangaConnectorIdId : string}) : ReactNode {
    const Api = useContext(ApiContext);
    const [useForDownloading, setUseForDownloading] = useState<boolean>(false);
    const [loading, setLoading] = useState<LoadingState>(LoadingState.none);
    
    useEffect(() => {
        setLoading(LoadingState.loading);
        Api.queryMangaMangaConnectorIdDetail(mangaConnectorIdId).then(response => {
            if (response.ok){
                setUseForDownloading(response.data.useForDownload as boolean);
                setLoading(LoadingState.none);
            }else 
                setLoading(LoadingState.failure);
        }).catch(_ => setLoading(LoadingState.failure));
    }, []);
    
    const onSelected = (event: ChangeEvent<HTMLInputElement>) => {
        setLoading(LoadingState.loading);
        const val = event.currentTarget.checked;
        Api.queryMangaMangaConnectorIdDetail(mangaConnectorIdId).then(response => {
            if (!response.ok){
                setLoading(LoadingState.failure);
                return;
            }
            Api.mangaSetAsDownloadFromCreate(response.data.objId, response.data.mangaConnectorName, val)
                .then(response => {
                    if (response.ok){
                        setUseForDownloading(val);
                        setLoading(LoadingState.success);
                    }else
                        setLoading(LoadingState.failure);
                }).catch(_ => setLoading(LoadingState.failure));
        }).catch(_ => setLoading(LoadingState.failure));
    }
    
    return (
        <Checkbox
            indeterminateIcon={StateIndicator(LoadingState.loading)}
            indeterminate={loading === LoadingState.loading}
            disabled={loading === LoadingState.loading}
            checked={useForDownloading}
            onChange={onSelected}
            label={
                <Typography>
                    <MangaConnectorLinkFromId MangaConnectorIdId={mangaConnectorIdId} printName={true} />
                </Typography>
        } />
    );
}