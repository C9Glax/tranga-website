import {
    Badge,
    Box,
    Card,
    CardContent, CardCover,
    Link,
} from "@mui/joy";
import IManga from "../api/types/IManga.ts";
import {CSSProperties, ReactElement, useCallback, useContext, useEffect, useRef, useState} from "react";
import {GetMangaById, GetMangaCoverImageUrl} from "../api/Manga.tsx";
import {ApiUriContext, getData} from "../api/fetchApi.tsx";
import {ReleaseStatusToPalette} from "../api/types/EnumMangaReleaseStatus.ts";
import {SxProps} from "@mui/joy/styles/types";
import MangaPopup from "./MangaPopup.tsx";
import {MangaConnectorContext} from "../api/Contexts/MangaConnectorContext.tsx";
import IMangaConnector from "../api/types/IMangaConnector.ts";

export function MangaFromId({mangaId, children} : { mangaId: string, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined }){
    const [manga, setManga] = useState<IManga>();

    const apiUri = useContext(ApiUriContext);

    const loadManga = useCallback(() => {
        GetMangaById(apiUri, mangaId).then(setManga);
    },[apiUri, mangaId]);

    useEffect(() => {
        loadManga();
    }, []);

    return (
        <>
            {manga === undefined ? <></> : <Manga manga={manga} children={children} /> }
        </>
    );
}

export const CardWidth = 190;
export const CardHeight = 300;

export function Manga({manga: manga, children} : { manga: IManga, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined}) {
    const CoverRef = useRef<HTMLImageElement>(null);

    const apiUri = useContext(ApiUriContext);
    const mangaConnectors = useContext(MangaConnectorContext);

    const [expanded, setExpanded] = useState(false);
    const [mangaConnector, setMangaConnector] = useState<IMangaConnector>();

    useEffect(() => {
        LoadMangaCover();
        setMangaConnector(mangaConnectors.find(all => all.name == manga.mangaConnectorName));
    }, [manga]);

    const LoadMangaCover = useCallback(() => {
        if(CoverRef.current == null)
            return;
        const coverUrl = GetMangaCoverImageUrl(apiUri, manga.mangaId, CoverRef.current);
        if(CoverRef.current.src == coverUrl)
            return;

        //Check if we can fetch the image exists (by fetching it), only then update
        getData(coverUrl).then(() => {
            if(CoverRef.current) CoverRef.current.src = coverUrl;
        });
    }, [manga, apiUri])

    const coverSx : SxProps = {
        height: CardHeight + "px",
        width: CardWidth + "px",
        position: "relative",
    }

    const coverCss : CSSProperties = {
        maxHeight: "calc("+CardHeight+"px + 2rem)",
        maxWidth: "calc("+CardWidth+"px + 2rem)",
    }

    const interactiveElements = ["button", "input", "textarea", "a", "select", "option", "li"];

    const mangaName = manga.name.length > 30 ? manga.name.substring(0, 27) + "..." : manga.name;

    return (
        <Badge sx={{margin:"8px !important"}} badgeContent={mangaConnector ? <img width={"24pt"} height={"24pt"} src={mangaConnector.iconUrl} /> : manga.mangaConnectorName} color={ReleaseStatusToPalette(manga.releaseStatus)} size={"lg"}>
            <Card sx={{height:"fit-content",width:"fit-content"}} onClick={(e) => {
                const target = e.target as HTMLElement;
                if(interactiveElements.find(x => x == target.localName) == undefined)
                    setExpanded(!expanded)}
            }>
                <CardCover>
                    <img style={coverCss} src={GetMangaCoverImageUrl(apiUri, manga.mangaId, CoverRef.current)} alt="Manga Cover"
                         ref={CoverRef}
                         onLoad={LoadMangaCover}/>
                </CardCover>
                <CardCover sx={{
                    background:
                        'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                }}/>
                <CardContent sx={{display: "flex", alignItems: "center", flexFlow: "row nowrap"}}>
                    <Box sx={coverSx}>
                        <Link href={manga.websiteUrl} level={"h3"} sx={{height:"min-content",width:"fit-content",color:"white",margin:"0 0 0 10px"}}>
                            {mangaName}
                        </Link>
                    </Box>
                </CardContent>
                <MangaPopup manga={manga} open={expanded}>{children}</MangaPopup>
            </Card>
        </Badge>
    );
}