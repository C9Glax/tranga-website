import {
    Badge,
    Box,
    Card,
    CardContent,
    CardCover,
    Chip,
    Link,
    Modal,
    ModalDialog,
    Stack, Tooltip,
    Typography
} from "@mui/joy";
import {Manga} from "../../apiClient/data-contracts.ts";
import {Dispatch, SetStateAction, useContext, useState} from "react";
import "./MangaCard.css";
import MangaConnectorBadge from "./MangaConnectorBadge.tsx";
import ModalClose from "@mui/joy/ModalClose";
import {ApiContext} from "../../apiClient/ApiContext.tsx";
import MarkdownPreview from '@uiw/react-markdown-preview';
import {MangaContext} from "../../App.tsx";

export function MangaCardFromId({mangaId} : {mangaId: string}) {
    const mangas = useContext(MangaContext);
    const manga = mangas.find(manga => manga.key === mangaId);
    
    return <MangaCard manga={manga} />
}

export function MangaCard({manga} : {manga: Manga | undefined}) {
    if (manga === undefined)
        return PlaceHolderCard();

    const [open, setOpen] = useState(false);
    
    return (
        <MangaConnectorBadge manga={manga}>
            <Card className={"manga-card"} onClick={() => setOpen(true)}>
                <CardCover className={"manga-cover"}>
                    <MangaCover manga={manga} />
                </CardCover>
                <CardCover className={"manga-cover-blur"} />
                <CardContent className={"manga-content"}>
                    <Typography level={"title-lg"}>{manga?.name}</Typography>
                </CardContent>
            </Card>
            <MangaModal manga={manga} open={open} setOpen={setOpen} />
        </MangaConnectorBadge>
    );
}

function MangaModal({manga, open, setOpen}: {manga: Manga | undefined, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) {

    return (
        <Modal open={open} onClose={() => setOpen(false)} className={"manga-modal"}>
            <ModalDialog style={{width:'100%'}}>
                <ModalClose />
                <Tooltip title={<Stack spacing={1}>{manga?.altTitles?.map(title => <Chip>{title.title}</Chip>)}</Stack>}>
                    <Typography level={"h4"} width={"fit-content"}>{manga?.name}</Typography>
                </Tooltip>
                <Stack direction={"row"} spacing={2}>
                    <Box className={"manga-card"}>
                        <MangaCover manga={manga} />
                    </Box>
                    <Stack direction={"column"} sx={{width: "calc(100% - 230px)"}}>
                        <Stack direction={"row"} flexWrap={"wrap"} useFlexGap spacing={0.5}>
                            {manga?.mangaTags?.map((tag) => <Chip key={tag.tag}>{tag.tag}</Chip>)}
                            {manga?.links?.map((link) => <Chip key={link.key}><Link href={link.linkUrl}>{link.linkProvider}</Link></Chip>)}
                        </Stack>
                        <Box>
                            <MarkdownPreview source={manga?.description}/>
                        </Box>
                    </Stack>
                </Stack>
            </ModalDialog>
        </Modal>
    );
}

function PlaceHolderCard(){
    return (
        <Badge>
            <Card className={"manga-card"}>
                <CardCover className={"manga-cover"}>
                    <img src={"/blahaj.png"} />
                </CardCover>
                <CardCover className={"manga-cover-blur"} />
            </Card>
        </Badge>
        );
}

function MangaCover({manga}: {manga: Manga | undefined}) {
    const api = useContext(ApiContext);
    const uri = manga ? `${api.baseUrl}/v2/Manga/${manga?.key}/Cover` : "blahaj.png";
        
    return (
        <img src={uri} style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--CardCover-radius)"}} />
    );
}