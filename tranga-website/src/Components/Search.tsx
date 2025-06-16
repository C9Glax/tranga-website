import {
    Avatar,
    Button,
    Chip,
    CircularProgress,
    Drawer,
    Input,
    ListItemDecorator,
    Option,
    Select, SelectOption,
    Skeleton,
    Stack,
    Step,
    StepIndicator,
    Stepper,
    Typography
} from "@mui/joy";
import ModalClose from "@mui/joy/ModalClose";
import IMangaConnector from "../api/types/IMangaConnector";
import {useCallback, useContext, useEffect, useState} from "react";
import {ApiUriContext} from "../api/fetchApi.tsx";
import {GetAllConnectors} from "../api/MangaConnector.tsx";
import IManga from "../api/types/IManga.ts";
import {SearchNameOnConnector, SearchUrl} from "../api/Search.tsx";
import {Manga} from "./Manga.tsx";
import Add from "@mui/icons-material/Add";
import React from "react";
import {CreateDownloadAvailableChaptersJob} from "../api/Job.tsx";
import ILocalLibrary from "../api/types/ILocalLibrary.ts";
import {GetLibraries} from "../api/LocalLibrary.tsx";
import { LibraryBooks } from "@mui/icons-material";

export default function Search({open, setOpen}:{open:boolean, setOpen:React.Dispatch<React.SetStateAction<boolean>>}){

    const [step, setStep] = useState<number>(2);

    const apiUri = useContext(ApiUriContext);
    const [mangaConnectors, setMangaConnectors] = useState<IMangaConnector[]>();
    const [mangaConnectorsLoading, setMangaConnectorsLoading] = useState<boolean>(true);
    const [selectedMangaConnector, setSelectedMangaConnector] = useState<IMangaConnector>();

    const loadMangaConnectors = useCallback(() => {
        setMangaConnectorsLoading(true);
        GetAllConnectors(apiUri).then(setMangaConnectors).finally(() => setMangaConnectorsLoading(false));
    }, [apiUri]);

    const [results, setResults] = useState<IManga[]|undefined>([]);
    const [resultsLoading, setResultsLoading] = useState<boolean>(false);

    const StartSearch = useCallback((mangaConnector : IMangaConnector | undefined, value: string)=>{
        if(mangaConnector === undefined && !IsValidUrl(value))
            return;
        setResults(undefined);
        setResultsLoading(true);
        setStep(3);
        if (IsValidUrl(value)){
            SearchUrl(apiUri, value).then((r) => setResults([r])).finally(() => setResultsLoading(false));
        }else if (mangaConnector != undefined){
            SearchNameOnConnector(apiUri, mangaConnector.name, value).then(setResults).finally(() => setResultsLoading(false));
        }
    },[apiUri])

    function IsValidUrl(str : string) : boolean {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return !!pattern.test(str);
    }

    const [localLibraries, setLocalLibraries] = useState<ILocalLibrary[]>();
    const [localLibrariesLoading, setLocalLibrariesLoading] = useState<boolean>(true);
    const [selectedLibraryId, setSelectedLibraryId] = useState<string>();

    const loadLocalLibraries = useCallback(() => {
        setLocalLibrariesLoading(true);
        GetLibraries(apiUri).then(setLocalLibraries).finally(() => setLocalLibrariesLoading(false));
    }, [apiUri]);

    useEffect(() => {
        loadMangaConnectors();
        loadLocalLibraries();
    },[apiUri]);

    useEffect(() => {
        loadMangaConnectors();
        loadLocalLibraries();
    }, []);

    function renderValue(option: SelectOption<string> | null) {
        if (!option) {
            return null;
        }

        return (
            <React.Fragment>
                <ListItemDecorator>
                    <Avatar size="sm" src={mangaConnectors?.find((o) => o.name === option.value)?.iconUrl} />
                </ListItemDecorator>
                {option.label}
            </React.Fragment>
        );
    }

    // @ts-ignore
    return (
        <Drawer size={"lg"} anchor={"right"} open={open} onClose={() => {
            if(step > 2)
                setStep(2);
            setResults([]);
            setOpen(false);
        }}>
            <ModalClose />
            <Stepper orientation={"vertical"} sx={{ height: '100%', width: "calc(100% - 80px)", margin:"40px"}}>
                <Step indicator={
                    <StepIndicator variant={step==1?"solid":"outlined"} color={(mangaConnectors?.length??0) < 1 ? "danger" : "primary"}>
                        1
                    </StepIndicator>}>
                    <Skeleton loading={mangaConnectorsLoading}>
                        <Select
                            color={(mangaConnectors?.length??0) < 1 ? "danger" : "neutral"}
                            disabled={mangaConnectorsLoading || resultsLoading || mangaConnectors?.length == null || mangaConnectors.length < 1}
                            placeholder={"Select Connector"}
                            slotProps={{
                                    listbox: {
                                        sx: {
                                            '--ListItemDecorator-size': '44px',
                                        },
                                    },
                                }}
                            sx={{ '--ListItemDecorator-size': '44px', minWidth: 240 }}
                            renderValue={renderValue}
                            onChange={(_e, newValue) => {
                                setSelectedMangaConnector(mangaConnectors?.find((o) => o.name === newValue));
                                setStep(2);
                                setResults(undefined);
                            }}
                            endDecorator={<Chip size={"sm"} color={mangaConnectors?.length??0 < 1 ? "danger" : "primary"}>{mangaConnectors?.length}</Chip>}>
                            {mangaConnectors?.map((connector: IMangaConnector) => ConnectorOption(connector))}
                        </Select>
                    </Skeleton>
                </Step>
                <Step indicator={
                    <StepIndicator variant={step==2?"solid":"outlined"} color="primary">
                        2
                    </StepIndicator>}>
                    <Input disabled={resultsLoading} placeholder={"Name or Url " + (selectedMangaConnector ? selectedMangaConnector.baseUris[0] : "")} onKeyDown={(e) => {
                        setStep(2);
                        setResults(undefined);
                        if(e.key === "Enter") {
                            StartSearch(selectedMangaConnector, e.currentTarget.value);
                        }
                    }}/>
                </Step>
                <Step indicator={
                    <StepIndicator variant={step==3?"solid":"outlined"} color="primary">
                        3
                    </StepIndicator>}>
                    <Typography endDecorator={<Chip size={"sm"} color={"primary"}>{results?.length??"-"}</Chip>}>Results</Typography>
                    <Skeleton loading={resultsLoading}>
                        <Stack direction={"row"} spacing={1} flexWrap={"wrap"}>
                            {results?.map((result) =>
                                <Manga key={result.mangaId} manga={result}>
                                    <Select
                                        placeholder={"Select Library"}
                                        defaultValue={""}
                                        startDecorator={<LibraryBooks />}
                                        value={selectedLibraryId}
                                        onChange={(_e, newValue) => setSelectedLibraryId(newValue!)}>
                                        {localLibrariesLoading ?
                                            <Option value={""} disabled>Loading <CircularProgress color={"primary"} size={"sm"} /></Option>
                                            :
                                            (localLibraries??[]).map(library => {
                                                return (
                                                    <Option value={library.localLibraryId}>{library.libraryName} ({library.basePath})</Option>
                                                );
                                            })}
                                    </Select>
                                    <Button disabled={localLibrariesLoading || selectedLibraryId === undefined} onClick={() => {
                                        CreateDownloadAvailableChaptersJob(apiUri, result.mangaId, {localLibraryId: selectedLibraryId!,recurrenceTimeMs: 1000 * 60 * 60 * 3, language: "en"})
                                    }} endDecorator={<Add />}>Watch</Button>
                                </Manga>)}
                        </Stack>
                    </Skeleton>
                </Step>
            </Stepper>
        </Drawer>
    );
}

function ConnectorOption(connector: IMangaConnector){
    return (
        <Option key={connector.name} value={connector.name} sx={{position: "relative"}}>
            <ListItemDecorator>
                <Avatar size="sm" src={connector.iconUrl} />
            </ListItemDecorator>
            {connector.name}
        </Option>
    );
}