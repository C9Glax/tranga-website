import {
    Avatar, Button, Chip,
    Drawer,
    Input,
    ListItemDecorator,
    Option,
    Select,
    SelectOption,
    Skeleton, Stack,
    Step,
    StepIndicator,
    Stepper, Typography
} from "@mui/joy";
import ModalClose from "@mui/joy/ModalClose";
import IMangaConnector from "../api/types/IMangaConnector";
import {useCallback, useContext, useEffect, useState} from "react";
import {ApiUriContext} from "../api/fetchApi.tsx";
import {GetAllConnectors} from "../api/MangaConnector.tsx";
import IManga from "../api/types/IManga.ts";
import {SearchNameOnConnector} from "../api/Search.tsx";
import {Manga} from "./Manga.tsx";
import Add from "@mui/icons-material/Add";
import React from "react";
import {CreateDownloadAvailableChaptersJob} from "../api/Job.tsx";

export default function Search({open, setOpen}:{open:boolean, setOpen:React.Dispatch<React.SetStateAction<boolean>>}){

    const [step, setStep] = useState<number>(1);

    const apiUri = useContext(ApiUriContext);
    const [mangaConnectors, setMangaConnectors] = useState<IMangaConnector[]>([]);
    const [mangaConnectorsLoading, setMangaConnectorsLoading] = useState<boolean>(true);
    const [selectedMangaConnector, setSelectedMangaConnector] = useState<IMangaConnector>();

    useEffect(() => {
        setMangaConnectorsLoading(true);
        GetAllConnectors(apiUri).then(setMangaConnectors).finally(() => setMangaConnectorsLoading(false));
    },[apiUri])

    const [results, setResults] = useState<IManga[]>([]);
    const [resultsLoading, setResultsLoading] = useState<boolean>(false);

    const StartSearch = useCallback((mangaConnector : IMangaConnector | undefined, value: string)=>{
        if(mangaConnector === undefined)
            return;
        setResults([]);
        setResultsLoading(true);
        SearchNameOnConnector(apiUri, mangaConnector.name, value).then(setResults).finally(() => setResultsLoading(false));
    },[apiUri])

    function renderValue(option: SelectOption<string> | null) {
        if (!option) {
            return null;
        }

        return (
            <React.Fragment>
                <ListItemDecorator>
                    <Avatar size="sm" src={mangaConnectors.find((o) => o.name === option.value)?.iconUrl} />
                </ListItemDecorator>
                {option.label}
            </React.Fragment>
        );
    }

    return (
        <Drawer size={"lg"} anchor={"right"} open={open} onClose={() => {
            setStep(2);
            setResults([]);
            setOpen(false);
        }}>
            <ModalClose />
            <Stepper orientation={"vertical"} sx={{ height: '100%', width: "calc(100% - 80px)", margin:"40px"}}>
                <Step indicator={
                    <StepIndicator variant="solid" color="primary">
                        1
                    </StepIndicator>}>
                    <Skeleton loading={mangaConnectorsLoading}>
                        <Select
                            disabled={mangaConnectorsLoading || resultsLoading}
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
                                setStep(2);
                                setSelectedMangaConnector(mangaConnectors.find((o) => o.name === newValue));
                            }}
                            endDecorator={<Chip size={"sm"} color={"primary"}>{mangaConnectors.length}</Chip>}>
                            {mangaConnectors?.map((connector: IMangaConnector) => ConnectorOption(connector))}
                        </Select>
                    </Skeleton>
                </Step>
                <Step indicator={
                    <StepIndicator variant="solid" color="primary">
                        2
                    </StepIndicator>}>
                    <Input disabled={step < 2 || resultsLoading} placeholder={"Name or Url " + (selectedMangaConnector ? selectedMangaConnector.baseUris[0] : "")} onKeyDown={(e) => {
                        setStep(2);
                        setResults([]);
                        if(e.key === "Enter") {
                            StartSearch(selectedMangaConnector, e.currentTarget.value);
                        }
                    }}/>
                </Step>
                <Step indicator={
                    <StepIndicator variant="solid" color="primary">
                        3
                    </StepIndicator>}>
                    <Typography>Results</Typography>
                    <Skeleton loading={resultsLoading}>
                        <Stack direction={"row"} spacing={1}>
                            {results.map((result) =>
                                <Manga key={result.mangaId} manga={result}>
                                    <Button onClick={() => {
                                        CreateDownloadAvailableChaptersJob(apiUri, result.mangaId, {localLibraryId: "",recurrenceTimeMs: 1000 * 60 * 60 * 3})
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