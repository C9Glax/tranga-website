import IManga from "../api/types/IManga.ts";
import {Badge, Box, Chip, CircularProgress, Drawer, Input, Link, Skeleton, Stack, Typography} from "@mui/joy";
import {ReactElement, useCallback, useContext, useEffect, useRef, useState} from "react";
import {GetLatestChapterAvailable, GetMangaCoverImageUrl, SetIgnoreThreshold} from "../api/Manga.tsx";
import {ApiUriContext, getData} from "../api/fetchApi.tsx";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {CardHeight} from "./Manga.tsx";
import IChapter from "../api/types/IChapter.ts";
import {MangaReleaseStatus, ReleaseStatusToPalette} from "../api/types/EnumMangaReleaseStatus.ts";
import {MangaConnectorContext} from "../api/Contexts/MangaConnectorContext.tsx";


export default function MangaPopup({manga, open, children} : {manga: IManga | null, open: boolean, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined}) {

    const apiUri = useContext(ApiUriContext);

    const CoverRef = useRef<HTMLImageElement>(null);

    const LoadMangaCover = useCallback(() => {
        if(CoverRef.current == null || manga == null)
            return;
        const coverUrl = GetMangaCoverImageUrl(apiUri, manga.mangaId, CoverRef.current);
        if(CoverRef.current.src == coverUrl)
            return;

        //Check if we can fetch the image exists (by fetching it), only then update
        getData(coverUrl).then(() => {
            if(CoverRef.current) CoverRef.current.src = coverUrl;
        });
    }, [manga, apiUri])

    useEffect(() => {
        if(!open)
            return;
        LoadMaxChapter();
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

    const [updatingThreshold, setUpdatingThreshold] = useState<boolean>(false);
    const updateIgnoreThreshhold = useCallback((value: number) => {
        if(manga == null)
            return;
        setUpdatingThreshold(true);
        SetIgnoreThreshold(apiUri, manga.mangaId, value).finally(() => setUpdatingThreshold(false));
    },[manga, apiUri])

    const mangaConnector = useContext(MangaConnectorContext).find(all => all.name == manga?.mangaConnectorName);

    return (
        <Drawer anchor="bottom" size="lg" open={open}>
            <Stack direction="column" spacing={2} margin={"10px"}>
                { /* Cover and Description */ }
                <Stack direction="row" spacing={2} margin={"10px"}>
                    <Badge sx={{margin:"8px !important"}} badgeContent={mangaConnector ? <img width={"24pt"} height={"24pt"} src={mangaConnector.iconUrl} /> : manga?.mangaConnectorName} color={ReleaseStatusToPalette(manga?.releaseStatus??MangaReleaseStatus.Unreleased)} size={"lg"}>
                        <img src="/blahaj.png" alt="Manga Cover"
                             ref={CoverRef}
                             onLoad={LoadMangaCover}/>
                    </Badge>
                    <Box>
                        <Link href={manga?.websiteUrl} level={"h2"}>
                            {manga?.name}
                        </Link>
                        <Stack direction={"row"} flexWrap={"wrap"} useFlexGap={true} spacing={0.3} sx={{maxHeight:CardHeight*0.3+"px", overflowY:"auto", scrollbarWidth: "thin"}}>
                            {manga?.authors?.map(author => <Chip key={author.authorId} variant={"outlined"} size={"md"} color={"success"}>{author.authorName}</Chip>)}
                            {manga?.mangaTags?.map(tag => <Chip key={tag.tag} variant={"soft"} size={"md"} color={"primary"}>{tag.tag}</Chip>)}
                            {manga?.links?.map(link =>
                                <Chip key={link.linkId} variant={"soft"} size={"md"} color={"warning"}>
                                    <Link sx={{textDecoration:"underline"}} level={"body-xs"} href={link?.linkUrl}>{link?.linkProvider??"Load Failed"}</Link>
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
                        placeholder={"0.0"}
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