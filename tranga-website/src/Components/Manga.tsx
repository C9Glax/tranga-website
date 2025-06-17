import {Badge, Box, Card, CardContent, CardCover, Skeleton, Tooltip, Typography,} from "@mui/joy";
import IManga from "../api/types/IManga.ts";
import {CSSProperties, ReactElement, useCallback, useContext, useEffect, useRef, useState} from "react";
import {GetMangaCoverImageUrl} from "../api/Manga.tsx";
import {ApiUriContext, getData} from "../api/fetchApi.tsx";
import {MangaReleaseStatus, ReleaseStatusToPalette} from "../api/types/EnumMangaReleaseStatus.ts";
import {SxProps} from "@mui/joy/styles/types";
import MangaPopup from "./MangaPopup.tsx";
import {MangaConnectorContext} from "../api/Contexts/MangaConnectorContext.tsx";
import {MangaContext} from "../api/Contexts/MangaContext.tsx";

export const CardWidth = 190;
export const CardHeight = 300;

const coverSx : SxProps = {
    height: CardHeight + "px",
    width: CardWidth + "px",
    position: "relative",
}

const coverCss : CSSProperties = {
    maxHeight: "calc("+CardHeight+"px + 2rem)",
    maxWidth: "calc("+CardWidth+"px + 2rem)",
}

export function MangaFromId({mangaId, children} : { mangaId: string, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined }){
    const mangaContext = useContext(MangaContext);

    const [manga, setManga] = useState<IManga | undefined>(undefined);
    mangaContext.GetManga(mangaId).then(setManga);

    return (
        manga === undefined ?
            <Badge sx={{margin:"8px !important"}} badgeContent={<Skeleton><Tooltip title={"Loading"}><img width={"24pt"} height={"24pt"} src={"/blahaj.png"} /></Tooltip></Skeleton>} color={ReleaseStatusToPalette(MangaReleaseStatus.Completed)} size={"lg"}>
                    <Card sx={{height:"fit-content",width:"fit-content"}}>
                        <CardCover>
                            <img style={coverCss} src={"/blahaj.png"} alt="Manga Cover"/>
                        </CardCover>
                        <CardCover sx={{
                            background:
                                'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                        }}/>
                        <CardContent sx={{display: "flex", alignItems: "center", flexFlow: "row nowrap"}}>
                            <Box sx={coverSx}>
                                <Typography level={"h3"} sx={{height:"min-content",width:"fit-content",color:"white",margin:"0 0 0 10px"}}>
                                    <Skeleton loading={true} animation={"wave"}>
                                        {mangaId.split("").splice(0,mangaId.length/2).join(" ")}
                                    </Skeleton>
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Badge>
                 :
                <Manga manga={manga} children={children} />
    );
}

export function Manga({manga: manga, children} : { manga: IManga, children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined}) {
    const CoverRef = useRef<HTMLImageElement>(null);

    const apiUri = useContext(ApiUriContext);
    const mangaConnector = useContext(MangaConnectorContext).find(all => all.name == manga.mangaConnectorName);

    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        LoadMangaCover();
    }, [manga, apiUri]);

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
    }, [manga, apiUri]);

    const interactiveElements = ["button", "input", "textarea", "a", "select", "option", "li"];

    const maxLength = 50;
    const mangaName = manga.name.length > maxLength ? manga.name.substring(0, maxLength-3) + "..." : manga.name;

    return (
        <Badge sx={{margin:"8px !important"}} badgeContent={mangaConnector ? <Tooltip color={ReleaseStatusToPalette(manga.releaseStatus)} title={manga.releaseStatus}><img width={"24pt"} height={"24pt"} src={mangaConnector.iconUrl} /></Tooltip> : manga.mangaConnectorName} color={ReleaseStatusToPalette(manga.releaseStatus)} size={"lg"}>
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
                        <Typography level={"h3"} sx={{height:"min-content",width:"fit-content",color:"white",margin:"0 0 0 10px"}}>
                            {mangaName}
                        </Typography>
                    </Box>
                </CardContent>
                <MangaPopup manga={manga} open={expanded} setOpen={setExpanded}>{children}</MangaPopup>
            </Card>
        </Badge>
    );
}