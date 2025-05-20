import {ReactElement, useContext, useState} from "react";
import IChapter from "../api/types/IChapter.ts";
import {Card, CardActions, CardContent, Chip, Link, Stack, Tooltip, Typography} from "@mui/joy";
import {MangaFromId} from "./Manga.tsx";
import {ChapterContext} from "../api/Contexts/ChapterContext.tsx";
import { Description } from "@mui/icons-material";

export function ChapterFromId({chapterId, children} : { chapterId: string, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined }){
    const chapterContext = useContext(ChapterContext);

    const [chapter, setChapter] = useState<IChapter | undefined>(undefined);
    chapterContext.GetChapter(chapterId).then(setChapter);

    return (
        chapter === undefined ?
                <Card>
                    <CardContent>
                        <Stack direction={"row"} alignItems="center" spacing={2}>
                            <Card>

                            </Card>
                            <Card>
                                <CardContent>

                                </CardContent>
                                <CardActions>
                                    {children}
                                </CardActions>
                            </Card>
                        </Stack>
                    </CardContent>
                </Card>
            :
            <Chapter chapter={chapter}>{children}</Chapter>
    );
}

export function Chapter({chapter, children} : { chapter: IChapter, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined }){
    return (
        <Card>
            <CardContent>
                <Stack direction={"row"} alignItems="center" spacing={2}>
                    <MangaFromId mangaId={chapter.parentMangaId} />
                    <Card>
                        <CardContent>
                                <Link level={"title-lg"} href={chapter.url}>{chapter.title}</Link>
                                <Typography>Vol. <Chip>{chapter.volumeNumber}</Chip></Typography>
                                <Typography>Ch. <Chip>{chapter.chapterNumber}</Chip></Typography>
                                <Tooltip title={chapter.fileName}>
                                    <Description />
                                </Tooltip>
                        </CardContent>
                        <CardActions>
                            {children}
                        </CardActions>
                    </Card>
                </Stack>
            </CardContent>
        </Card>
    );
}