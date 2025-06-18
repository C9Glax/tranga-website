import React, {ReactElement, useContext, useState} from "react";
import IChapter from "../api/types/IChapter.ts";
import {Box, Chip, Link, Stack, Tooltip, Typography} from "@mui/joy";
import {MangaFromId} from "./Manga.tsx";
import {ChapterContext} from "../api/Contexts/ChapterContext.tsx";
import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";
import {Archive} from "@mui/icons-material";

export function ChapterPopupFromId({chapterId, open, setOpen, children}: { chapterId: string | null, open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined }) {
    return (
        <Drawer anchor={"bottom"} open={open} onClose={() => setOpen(false)}>
            <ModalClose />
            {
                chapterId !== null ?
                    <ChapterFromId chapterId={chapterId}>{children}</ChapterFromId>
                    : null
            }
        </Drawer>
    )
}

export function ChapterFromId({chapterId, children} : { chapterId: string, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined }){
    const chapterContext = useContext(ChapterContext);

    const [chapter, setChapter] = useState<IChapter | undefined>(undefined);
    chapterContext.GetChapter(chapterId).then(setChapter);

    return (
        chapter === undefined ?
                null
            :
            <Chapter chapter={chapter}>{children}</Chapter>
    );
}

export function Chapter({chapter, children} : { chapter: IChapter, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined }){
    return (
        <Stack direction={"row"} spacing={5} sx={{paddingTop: "10px"}}>
            <MangaFromId mangaId={chapter.parentMangaId} />
            <Box>
                <Link target={"_blank"} level={"title-lg"} href={chapter.url}>{chapter.title}</Link>
                <Typography>Volume <Chip>{chapter.volumeNumber}</Chip></Typography>
                <Typography>Chapter <Chip>{chapter.chapterNumber}</Chip></Typography>
                <Tooltip title={chapter.fullArchiveFilePath} placement={"bottom-start"}><Archive /></Tooltip>
            </Box>
            {children}
        </Stack>
    );
}