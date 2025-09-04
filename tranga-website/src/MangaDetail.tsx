import {Manga} from "./api/data-contracts.ts";
import {Dispatch, ReactNode, useContext, useEffect, useState} from "react";
import {Card, CardCover, Chip, Modal, ModalDialog, Stack, Typography, useTheme} from "@mui/joy";
import ModalClose from "@mui/joy/ModalClose";
import {ApiContext} from "./contexts/ApiContext.tsx";
import {MangaContext} from "./contexts/MangaContext.tsx";
import './Components/Mangas/MangaCard.css'
import MarkdownPreview from "@uiw/react-markdown-preview";

export default function MangaDetail (props: MangaDetailProps) : ReactNode {
    const Api = useContext(ApiContext);
    const Manga = useContext(MangaContext);

    const [manga, setManga] = useState<Manga | undefined>(props.manga)

    useEffect(() => {
        if (!props.open) return;
        if (!props.mangaKey) return;
        if (props.manga != undefined) return;
        Manga.GetManga(props.mangaKey).then(setManga);
    }, [Api, props]);
    
    const theme = useTheme();
    
    return (
        <Modal open={props.open} onClose={() => props.setOpen(false)}>
            <ModalDialog>
                <ModalClose />
                <div style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row'}}>
                    <Typography level={"h3"} sx={{width: '100%'}}>{manga?.name}</Typography>
                    <Card className={'manga-card'}>
                        <CardCover className={'manga-card-cover'}>
                            <img src={manga ? `${Api.baseUrl}/v2/Manga/${manga.key}/Cover` : '/blahaj.png'} />
                        </CardCover>
                    </Card>
                    <Stack direction={'column'} gap={2} sx={{maxWidth: 'calc(100% - 230px)', margin: '5px'}}>
                        <Stack direction={'row'} gap={0.5} flexWrap={'wrap'}>
                            {manga?.tags.map(tag => <Chip key={tag} size={"sm"} sx={{backgroundColor: theme.palette.primary.plainColor}}>{tag}</Chip>)}
                            {manga?.authors.map(author => <Chip key={author.key} size={'sm'} sx={{backgroundColor: theme.palette.success.plainColor}}>{author.name}</Chip> )}
                            {manga?.links.map(link => <Chip key={link.provider} size={"sm"} sx={{backgroundColor: theme.palette.neutral.plainColor}}><a href={link.url}>{link.provider}</a></Chip>)}
                        </Stack>
                        <MarkdownPreview source={manga?.description} style={{backgroundColor: "transparent", color: theme.palette.text.primary, overflowY: "auto"}}/>
                    </Stack>
                    <Stack sx={{flexGrow: 1, flexBasis: 0, margin: '5px 0', alignItems: 'flex-end'}} flexWrap={'nowrap'} gap={1}>
                        {props.actions}
                    </Stack>
                </div>
            </ModalDialog>
        </Modal>  
    );
}

export interface MangaDetailProps {
    manga?: Manga;
    mangaKey?: string;
    open: boolean;
    setOpen: Dispatch<boolean>;
    actions?: ReactNode[];
}