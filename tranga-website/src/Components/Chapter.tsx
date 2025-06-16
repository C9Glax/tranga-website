import React, {ReactElement, useContext, useState} from "react";
import IChapter from "../api/types/IChapter.ts";
import {Box, Chip, Link, Stack, Typography} from "@mui/joy";
import {MangaFromId} from "./Manga.tsx";
import {ChapterContext} from "../api/Contexts/ChapterContext.tsx";
import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";

export function ChapterPopupFromId({chapterId, open, setOpen, children}: { chapterId: string | null, open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined }) {
    return (
        <Drawer open={open} onClose={() => setOpen(false)}>
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
        <Stack direction={"row"}>
            <MangaFromId mangaId={chapter.parentMangaId} />
            <Box>
                <Link level={"title-lg"} href={chapter.url}>{chapter.title}</Link>
                <Typography>Volume <Chip>{chapter.volumeNumber}</Chip></Typography>
                <Typography>Chapter <Chip>{chapter.chapterNumber}</Chip></Typography>
                <Typography>Title <Chip>{chapter.title}</Chip></Typography>
            </Box>
            {children}
        </Stack>
    );
}