import IManga from "../api/types/IManga.ts";
import {Badge, Box, Chip, CircularProgress, Drawer, Input, Link, Skeleton, Stack, Typography} from "@mui/joy";
import React, {ReactElement, useCallback, useContext, useEffect, useRef, useState} from "react";
import {
    GetLatestChapterAvailable,
    GetLatestChapterDownloaded,
    GetMangaCoverImageUrl,
    SetIgnoreThreshold
} from "../api/Manga.tsx";
import {ApiUriContext, getData} from "../api/fetchApi.tsx";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {CardHeight} from "./Manga.tsx";
import IChapter from "../api/types/IChapter.ts";
import {MangaReleaseStatus, ReleaseStatusToPalette} from "../api/types/EnumMangaReleaseStatus.ts";
import {MangaConnectorContext} from "../api/Contexts/MangaConnectorContext.tsx";
import {MangaContext} from "../api/Contexts/MangaContext.tsx";
import ModalClose from "@mui/joy/ModalClose";


export function MangaPopupFromId({mangaId, open, setOpen, children} : {mangaId: string | null, open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined}) {
    const mangaContext = useContext(MangaContext);

    const [manga, setManga] = useState<IManga | undefined>(undefined);

    useEffect(() => {
        if (!open || mangaId === null)
            return;
        mangaContext.GetManga(mangaId).then(setManga);
    }, [open]);

    return (
        manga === undefined ?
            <Drawer anchor="bottom" size="lg" open={open} onClose={() => setOpen(false)}>
                <ModalClose />
                <Stack direction="column" spacing={2} margin={"10px"}>
                    { /* Cover and Description */ }
                    <Stack direction="row" spacing={2} margin={"10px"}>
                        <Badge sx={{margin:"8px !important"}} color={ReleaseStatusToPalette(MangaReleaseStatus.Unreleased)} size={"lg"}>
                            <img src="/blahaj.png" alt="Manga Cover"/>
                        </Badge>
                        <Box>
                            <Skeleton loading={true} animation={"wave"}>
                                {mangaId?.split("").splice(0,mangaId.length/2).join(" ")}
                            </Skeleton>
                            <Stack direction={"row"} flexWrap={"wrap"} useFlexGap={true} spacing={0.3} sx={{maxHeight:CardHeight*0.3+"px", overflowY:"auto", scrollbarWidth: "thin"}}>
                                {mangaId?.split("").filter(x => Number.isNaN(x)).map(_ =>
                                    <Skeleton loading={true} animation={"wave"}>
                                        <Chip>Wow</Chip>
                                    </Skeleton>
                                )}
                            </Stack>
                            <MarkdownPreview style={{backgroundColor: "transparent", color: "var(--joy-palette-neutral-50)", maxHeight:CardHeight*0.7+"px", overflowY:"auto", marginTop:"10px", scrollbarWidth: "thin"}} />
                        </Box>
                    </Stack>
    
                    { /* Actions */ }
                    <Stack direction="row" spacing={2}>
                        {children}
                    </Stack>
                </Stack>
            </Drawer> 
            :
            <MangaPopup manga={manga} open={open} setOpen={setOpen}>{children}</MangaPopup>
    );
}

export default function MangaPopup({manga, open, setOpen, children} : {manga: IManga | null, open: boolean, setOpen:React.Dispatch<React.SetStateAction<boolean>>, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined}) {

    const apiUri = useContext(ApiUriContext);

    const CoverRef = useRef<HTMLImageElement>(null);

    const LoadMangaCover = useCallback(() => {
        if(CoverRef.current == null || manga == null)
            return;
        if (!open)
            return;
        const coverUrl = GetMangaCoverImageUrl(apiUri, manga.mangaId, CoverRef.current);
        if(CoverRef.current.src == coverUrl)
            return;

        //Check if we can fetch the image exists (by fetching it), only then update
        getData(coverUrl).then(() => {
            if(CoverRef.current) CoverRef.current.src = coverUrl;
        });
    }, [manga, apiUri, open])

    useEffect(() => {
        if(!open)
            return;
        LoadMaxChapter();
        LoadDownloadedChapter();
        LoadMangaCover();
    }, [open]);

    const [mangaMaxChapter, setMangaMaxChapter] = useState<IChapter>();
    const [maxChapterLoading, setMaxChapterLoading] = useState<boolean>(true);
    const LoadMaxChapter = useCallback(() => {
        if(manga == null)
            return;
        setMaxChapterLoading(true);
        GetLatestChapterAvailable(apiUri, manga.mangaId)
            .then(setMangaMaxChapter)
            .finally(() => setMaxChapterLoading(false));
    }, [manga, apiUri]);

    const [mangaDownloadedChapter, setMangaDownloadedChapter] = useState<IChapter>();
    const [downloadedChapterLoading, setDownloadedChapterLoading] = useState<boolean>(true);
    const LoadDownloadedChapter = useCallback(() => {
        if(manga == null)
            return;
        setDownloadedChapterLoading(true);
        GetLatestChapterDownloaded(apiUri, manga.mangaId)
            .then(setMangaDownloadedChapter)
            .finally(() => setDownloadedChapterLoading(false));
    }, [manga, apiUri]);

    const [updatingThreshold, setUpdatingThreshold] = useState<boolean>(false);
    const updateIgnoreThreshhold = useCallback((value: number) => {
        if(manga == null)
            return;
        setUpdatingThreshold(true);
        SetIgnoreThreshold(apiUri, manga.mangaId, value).finally(() => setUpdatingThreshold(false));
    },[manga, apiUri])

    const mangaConnector = useContext(MangaConnectorContext).find(all => all.name == manga?.mangaConnectorName);

    return (
        <Drawer anchor="bottom" size="lg" open={open} onClose={() => setOpen(false)}>
            <ModalClose />
            <Stack direction="column" spacing={2} margin={"10px"}>
                { /* Cover and Description */ }
                <Stack direction="row" spacing={2} margin={"10px"}>
                    <Badge sx={{margin:"8px !important"}} badgeContent={mangaConnector ? <img width={"24pt"} height={"24pt"} src={mangaConnector.iconUrl} /> : manga?.mangaConnectorName} color={ReleaseStatusToPalette(manga?.releaseStatus??MangaReleaseStatus.Unreleased)} size={"lg"}>
                        <img src="/blahaj.png" alt="Manga Cover"
                             ref={CoverRef}
                             onLoad={LoadMangaCover}/>
                    </Badge>
                    <Box>
                        <Link target={"_blank"} href={manga?.websiteUrl} level={"h2"}>
                            {manga?.name}
                        </Link>
                        <Stack direction={"row"} flexWrap={"wrap"} useFlexGap={true} spacing={0.3} sx={{maxHeight:CardHeight*0.3+"px", overflowY:"auto", scrollbarWidth: "thin"}}>
                            {manga?.authors?.map(author => <Chip key={author.authorId} variant={"outlined"} size={"md"} color={"success"}>{author.authorName}</Chip>)}
                            {manga?.mangaTags?.map(tag => <Chip key={tag.tag} variant={"soft"} size={"md"} color={"primary"}>{tag.tag}</Chip>)}
                            {manga?.links?.map(link =>
                                <Chip key={link.linkId} variant={"soft"} size={"md"} color={"warning"}>
                                    <Link target={"_blank"} sx={{textDecoration:"underline"}} level={"body-xs"} href={link?.linkUrl}>{link?.linkProvider??"Load Failed"}</Link>
                                </Chip>
                            )}
                        </Stack>
                        <MarkdownPreview source={manga?.description} style={{backgroundColor: "transparent", color: "var(--joy-palette-neutral-50)", maxHeight:CardHeight*0.7+"px", overflowY:"auto", marginTop:"10px", scrollbarWidth: "thin"}} />
                    </Box>
                </Stack>

                { /* Actions */ }
                <Stack direction="row" spacing={2}>
                    <Input
                        type={"number"}
                        placeholder={downloadedChapterLoading ? "" : mangaDownloadedChapter?.chapterNumber??"0.0"}
                        startDecorator={
                            <>
                                {
                                    updatingThreshold ?
                                        <CircularProgress color={"primary"} size={"sm"} />
                                        : <Typography>Ch.</Typography>
                                }
                            </>
                        }
                        endDecorator={
                            <Typography>
                                <Skeleton loading={maxChapterLoading}>
                                    /{mangaMaxChapter?.chapterNumber??"-"}
                                </Skeleton>
                            </Typography>
                        }
                        sx={{width:"min-content"}}
                        size={"md"}
                        onChange={(e) => updateIgnoreThreshhold(e.currentTarget.valueAsNumber)}
                    />
                    {children}
                </Stack>
            </Stack>
        </Drawer>
    );
}