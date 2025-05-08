import {
    Badge,
    Box,
    Card,
    CardActions,
    CardContent, CardCover,
    Chip, CircularProgress,
    Input,
    Link,
    Skeleton,
    Stack,
    Typography
} from "@mui/joy";
import IManga, {DefaultManga} from "../api/types/IManga.ts";
import {CSSProperties, ReactElement, useCallback, useContext, useEffect, useRef, useState} from "react";
import {GetLatestChapterAvailable, GetMangaById, GetMangaCoverImageUrl, SetIgnoreThreshold} from "../api/Manga.tsx";
import {ApiUriContext} from "../api/fetchApi.tsx";
import AuthorTag from "./AuthorTag.tsx";
import LinkTag from "./LinkTag.tsx";
import {ReleaseStatusToPalette} from "../api/types/EnumMangaReleaseStatus.ts";
import IChapter from "../api/types/IChapter.ts";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {SxProps} from "@mui/joy/styles/types";

export function MangaFromId({mangaId, children} : { mangaId: string, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined }){
    const [manga, setManga] = useState(DefaultManga);
    const [loading, setLoading] = useState(true);

    const apiUri = useContext(ApiUriContext);

    const loadManga = useCallback(() => {
        setLoading(true);
        GetMangaById(apiUri, mangaId).then(setManga).finally(() => setLoading(false));
    },[apiUri, mangaId]);

    useEffect(() => {
        loadManga();
    }, []);

    return <Manga manga={manga} loading={loading} children={children} />
}

export function Manga({manga, children, loading} : { manga: IManga | undefined, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined, loading?: boolean}) {
    const useManga = manga ?? DefaultManga;
    loading = loading ?? false;
    const CoverRef = useRef<HTMLImageElement>(null);

    const apiUri = useContext(ApiUriContext);

    const [expanded, setExpanded] = useState(false);

    const [mangaMaxChapter, setMangaMaxChapter] = useState<IChapter>();
    const [maxChapterLoading, setMaxChapterLoading] = useState<boolean>(true);
    const LoadMaxChapter = useCallback(() => {
        setMaxChapterLoading(true);
        GetLatestChapterAvailable(apiUri, useManga.mangaId)
            .then(setMangaMaxChapter)
            .finally(() => setMaxChapterLoading(false));
    }, [useManga, apiUri]);

    const [updatingThreshold, setUpdatingThreshold] = useState<boolean>(false);
    const updateIgnoreThreshhold = useCallback((value: number) => {
        setUpdatingThreshold(true);
        SetIgnoreThreshold(apiUri, useManga.mangaId, value).finally(() => setUpdatingThreshold(false));
    },[useManga, apiUri])

    useEffect(() => {
        LoadMaxChapter();
        LoadMangaCover();
    }, [useManga]);

    const LoadMangaCover = useCallback(() => {
        if(CoverRef.current == null)
            return;
        const coverUrl = GetMangaCoverImageUrl(apiUri, useManga.mangaId, CoverRef.current);
        if(CoverRef.current.src == coverUrl)
            return;
        CoverRef.current.src = GetMangaCoverImageUrl(apiUri, useManga.mangaId, CoverRef.current);
    }, [useManga, apiUri])

    const width = 200;
    const height = 300;

    const coverSx : SxProps = {
        height: height + "px",
        width: width + "px",
        position: "relative",
    }

    const descriptionSx : SxProps = {
        height: height + "px",
        width: width * 2 + "px",
        position: "relative"
    }

    const coverCss : CSSProperties = {
        maxHeight: "calc("+height+"px + 2rem)",
        maxWidth: "calc("+width+"px + 2rem)",
    }

    const interactiveElements = ["button", "input", "textarea", "a", "select", "option", "li"];

    return (
        <Badge sx={{margin:"8px !important"}} badgeContent={useManga.mangaConnectorId} color={ReleaseStatusToPalette(useManga.releaseStatus)} size={"lg"}>
            <Card sx={{height:"fit-content",width:"fit-content"}} onClick={(e) => {
                const target = e.target as HTMLElement;
                if(interactiveElements.find(x => x == target.localName) == undefined)
                    setExpanded(!expanded)}
            }>
                <CardCover>
                    <img style={coverCss} src="/blahaj.png" alt="Manga Cover"
                         ref={CoverRef}
                         onLoad={LoadMangaCover}
                         onResize={LoadMangaCover}/>
                </CardCover>
                <CardCover sx={{
                    background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                }}/>
                <CardContent sx={{display: "flex", alignItems: "center", flexFlow: "row nowrap"}}>
                    <Box sx={coverSx}>
                        <Skeleton loading={loading}>
                            <Link href={useManga.websiteUrl} level={"h3"} sx={{height:"min-content",width:"fit-content",color:"white",margin:"0 0 0 10px"}}>
                                {useManga.name}
                            </Link>
                        </Skeleton>
                    </Box>
                    {
                        expanded ?
                            <Box sx={descriptionSx}>
                                <Skeleton loading={loading} variant={"text"} level={"title-lg"}>
                                    <Stack direction={"row"} flexWrap={"wrap"} spacing={0.5} sx={{maxHeight:height*0.3+"px", overflowY:"auto", scrollbarWidth: "thin"}}>
                                        {useManga.authorIds.map(authorId => <AuthorTag key={authorId} authorId={authorId} color={"success"} />)}
                                        {useManga.tags.map(tag => <Chip key={tag} variant={"soft"} size={"md"} color={"primary"}>{tag}</Chip>)}
                                        {useManga.linkIds.map(linkId => <LinkTag key={linkId} linkId={linkId} color={"warning"} />)}
                                    </Stack>
                                </Skeleton>
                                <Skeleton loading={loading} sx={{maxHeight:"300px"}}>
                                    <MarkdownPreview source={useManga.description} style={{backgroundColor: "transparent", color: "black", maxHeight:height*0.7+"px", overflowY:"auto", marginTop:"10px", scrollbarWidth: "thin"}} />
                                </Skeleton>
                            </Box>
                            : null
                    }
                </CardContent>
                {
                    expanded ?
                        <CardActions sx={{justifyContent:"space-between"}}>
                            <Skeleton loading={loading} sx={{maxHeight: "30px", maxWidth:"calc(100% - 40px)"}}>
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
                                                /{mangaMaxChapter?.chapterNumber??"Load Failed"}
                                            </Skeleton>
                                        </Typography>
                                    }
                                    sx={{width:"min-content"}}
                                    size={"md"}
                                    onChange={(e) => updateIgnoreThreshhold(e.currentTarget.valueAsNumber)}
                                />
                                {children}
                            </Skeleton>
                        </CardActions>
                        : null
                }
            </Card>
        </Badge>
    );
}