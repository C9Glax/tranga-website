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
import {ReactElement, useCallback, useContext, useEffect, useState} from "react";
import {GetLatestChapterAvailable, GetMangaCoverImageUrl, SetIgnoreThreshold} from "../api/Manga.tsx";
import {ApiUriContext} from "../api/fetchApi.tsx";
import AuthorTag from "./AuthorTag.tsx";
import LinkTag from "./LinkTag.tsx";
import {ReleaseStatusToPalette} from "../api/types/EnumMangaReleaseStatus.ts";
import IChapter from "../api/types/IChapter.ts";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {SxProps} from "@mui/joy/styles/types";

export function Manga({manga, children} : { manga: IManga | undefined, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined }) {
    const useManga = manga ?? DefaultManga;

    const apiUri = useContext(ApiUriContext);

    const [expanded, setExpanded] = useState(false);

    const [mangaMaxChapter, setMangaMaxChapter] = useState<IChapter>();
    const [maxChapterLoading, setMaxChapterLoading] = useState<boolean>(true);
    const loadMaxChapter = useCallback(() => {
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
        loadMaxChapter();
    }, []);

    const LoadMangaCover = useCallback((e : EventTarget & HTMLImageElement) => {
        if(e.src != GetMangaCoverImageUrl(apiUri, useManga.mangaId, e))
            e.src = GetMangaCoverImageUrl(apiUri, useManga.mangaId, e);
    }, [useManga, apiUri])

    const sideSx : SxProps = {
        height: "400px",
        width: "300px",
        position: "relative",
    }

    const interactiveElements = ["button", "input", "textarea", "a", "select", "option", "li"];

    return (
        <Badge badgeContent={useManga.mangaConnectorId} color={ReleaseStatusToPalette(useManga.releaseStatus)} size={"lg"}>
            <Card sx={{height:"fit-content",width:"fit-content"}} onClick={(e) => {
                const target = e.target as HTMLElement;
                if(interactiveElements.find(x => x == target.localName) == undefined)
                    setExpanded(!expanded)}
            }>
                <CardCover sx={{margin: "var(--Card-padding)"}}>
                    <img style={{maxHeight:"100%",height:"400px",width:"300px"}} src="/blahaj.png" alt="Manga Cover"
                         onLoad={(e) => LoadMangaCover(e.currentTarget)}
                         onResize={(e) => LoadMangaCover(e.currentTarget)}/>
                </CardCover>
                <CardCover sx={{
                    background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                }}/>
                <CardContent sx={{display: "flex", alignItems: "center", flexFlow: "row nowrap"}}>
                    <Box sx={sideSx}>
                        <Link href={useManga.websiteUrl} level={"h1"} sx={{height:"min-content",width:"fit-content",color:"white",margin:"0 0 0 10px"}}>
                            {useManga.name}
                        </Link>
                    </Box>
                    {
                        expanded ?
                            <Box sx={sideSx}>
                                <Stack direction={"row"} flexWrap={"wrap"} spacing={0.5}>
                                    {useManga.authorIds.map(authorId => <AuthorTag key={authorId} authorId={authorId} color={"success"} />)}
                                    {useManga.tags.map(tag => <Chip key={tag} variant={"outlined"} size={"md"} color={"primary"}>{tag}</Chip>)}
                                    {useManga.linkIds.map(linkId => <LinkTag key={linkId} linkId={linkId} color={"danger"} />)}
                                </Stack>
                                <MarkdownPreview source={useManga.description} style={{backgroundColor: "transparent", color: "black"}} />
                            </Box>
                            : null
                    }
                </CardContent>
                {
                    expanded ?
                        <CardActions sx={{justifyContent:"space-between"}}>
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
                        </CardActions>
                        : null
                }
            </Card>
        </Badge>
    );
}