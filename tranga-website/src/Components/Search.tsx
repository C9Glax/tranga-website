import {Dispatch, KeyboardEventHandler, ReactNode, useContext, useState} from "react";
import {
    Badge, Button,
    Card,
    CardContent,
    CardCover,
    Input,
    Modal,
    ModalDialog, Option, Select,
    Step,
    StepIndicator,
    Stepper,
    Typography
} from "@mui/joy";
import ModalClose from "@mui/joy/ModalClose";
import {MangaConnectorContext} from "../App.tsx";
import {Manga, MangaConnector} from "../apiClient/data-contracts.ts";
import MangaList from "./Mangas/MangaList.tsx";
import {ApiContext} from "../apiClient/ApiContext.tsx";

export default function () : ReactNode {
    const [open, setOpen] = useState(false);
    
    return (
        <Badge badgeContent={"+"}>
            <Card onClick={() => {if (!open) setOpen(true)}} className={"manga-card"}>
                <CardCover className={"manga-cover"}>
                    <img src={"/blahaj.png"} />
                </CardCover>
                <CardCover className={"manga-cover-blur"} />
                <CardContent>
                    Add
                </CardContent>
                <CardContent>
                    <SearchDialog open={open} setOpen={setOpen} />
                </CardContent>
            </Card>
        </Badge>
    );
}

function SearchDialog ({open, setOpen} : {open: boolean, setOpen: Dispatch<boolean>}) : ReactNode {
    const mangaConnectors = useContext(MangaConnectorContext);
    const Api = useContext(ApiContext);
    
    const [selectedMangaConnector, setSelectedMangaConnector] = useState<MangaConnector | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string>();
    const [searchResults, setSearchResults] = useState<Manga[]>([]);
    
    const doTheSearch = () => {
        if (searchTerm === undefined || searchTerm.length < 1)
            return;
        if (!isUrl(searchTerm) && selectedMangaConnector === undefined)
            return;
        
        if (isUrl(searchTerm))
            Api.searchUrlCreate(searchTerm)
                .then(response => {
                    if (response.ok)
                        setSearchResults([response.data]);
                });
        else
            Api.searchDetail(selectedMangaConnector!.name, searchTerm)
                .then(response => {
                    if(response.ok)
                        setSearchResults(response.data);
                });
    }
    
    const isUrl = (url: string) => {
        try{
            new URL(url);
            return true;
        }catch (Error){
            return false;
        }
    }
    
    const keyDownCheck : KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "Enter") {
            doTheSearch();
        }
    }
    
    return (
        <Modal sx={{width: "100%", height: "100%"}} open={open} onClose={() => setOpen(false)}>
            <ModalDialog sx={{width: "80%"}}>
                <ModalClose />
                <Stepper orientation={"vertical"}>
                    <Step indicator={<StepIndicator>1</StepIndicator>}>
                        <Typography>Connector</Typography>
                        <Select onChange={(_, v) => setSelectedMangaConnector(v as MangaConnector)}>
                            {mangaConnectors?.map(con => (
                                <Option value={con}>
                                    <Typography><img src={con.iconUrl} style={{maxHeight: "var(--Icon-fontSize)"}} />{con.name}</Typography>
                                </Option>
                            ))}
                        </Select>
                    </Step>
                    <Step indicator={<StepIndicator>2</StepIndicator>}>
                        <Typography>Search</Typography>
                        <Input onKeyDown={keyDownCheck}
                               onChange={(e) => setSearchTerm(e.currentTarget.value)} 
                               endDecorator={<Button onClick={doTheSearch}>Search</Button>}
                        />
                    </Step>
                    <Step indicator={<StepIndicator>3</StepIndicator>}>
                        <Typography>Result</Typography>
                        <MangaList mangas={searchResults} />
                    </Step>
                </Stepper>
            </ModalDialog>
        </Modal>
    );
}