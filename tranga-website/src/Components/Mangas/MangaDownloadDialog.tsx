import {Manga} from "../../apiClient/data-contracts.ts";
import {Dispatch, ReactNode, useContext, useState} from "react";
import {Button, Checkbox, Option, Select, Stack, Typography} from "@mui/joy";
import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";
import {MangaConnectorLinkFromId} from "../MangaConnectorLink.tsx";
import Sheet from "@mui/joy/Sheet";
import {FileLibraryContext} from "../../App.tsx";

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
    
    return (
        <Drawer open={open} onClose={() => setOpen(false)}>
            <ModalClose />
            <Sheet sx={{width: "calc(95% - 60px)", margin: "30px"}}>
                <Typography>Download to Library:</Typography>
                <Select placeholder={"Library"}>
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
    return (
        <Checkbox label={<Typography><MangaConnectorLinkFromId MangaConnectorIdId={mangaConnectorIdId} /></Typography>} />
    );
}