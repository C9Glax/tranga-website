import IBackendSettings from "../../api/types/IBackendSettings";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, Chip,
    CircularProgress,
    ColorPaletteProp,
    Divider,
    Input,
    Stack, Tooltip, Typography
} from "@mui/joy";
import {KeyboardEventHandler, useCallback, useContext, useState} from "react";
import {ApiUriContext} from "../../api/fetchApi.tsx";
import {UpdateChapterNamingScheme} from "../../api/BackendSettings.tsx";

export default function ChapterNamingScheme({backendSettings}: {backendSettings?: IBackendSettings}) {
    const apiUri = useContext(ApiUriContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");
    const [color, setColor] = useState<ColorPaletteProp>("neutral");

    const keyDown : KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
        if(e.key === "Enter") {
            setLoading(true);
            UpdateChapterNamingScheme(apiUri, value)
                .then(() => setColor("success"))
                .catch(() => setColor("danger"))
                .finally(() => setLoading(false));
        }
    }, [apiUri])

    return (
        <Accordion>
            <AccordionSummary>Chapter Naming Scheme</AccordionSummary>
            <AccordionDetails>
                <Input disabled={backendSettings === undefined || loading}
                       placeholder={"Chapter Naming Scheme"}
                       defaultValue={backendSettings?.chapterNamingScheme}
                       onKeyDown={keyDown}
                       onChange={e => setValue(e.target.value)}
                       color={color}
                       endDecorator={(loading ? <CircularProgress color={"primary"} size={"sm"} /> : null)}
                />
                <Typography level={"title-sm"}>Placeholders:</Typography>
                <Stack direction="row" spacing={1} divider={<Divider />}>
                    <Tooltip arrow placement="bottom" size="md" variant="outlined"
                             title={"Manga Title"} >
                        <Chip color={"primary"}>%M</Chip>
                    </Tooltip>
                    <Tooltip arrow placement="bottom" size="md" variant="outlined"
                             title={"Volume Number"} >
                        <Chip color={"primary"}>%V</Chip>
                    </Tooltip>
                    <Tooltip arrow placement="bottom" size="md" variant="outlined"
                             title={"Chapter Number"} >
                        <Chip color={"primary"}>%C</Chip>
                    </Tooltip>
                    <Tooltip arrow placement="bottom" size="md" variant="outlined"
                             title={"Chapter Title"} >
                        <Chip color={"primary"}>%T</Chip>
                    </Tooltip>
                    <Tooltip arrow placement="bottom" size="md" variant="outlined"
                             title={"Year"} >
                        <Chip color={"primary"}>%Y</Chip>
                    </Tooltip>
                    <Tooltip arrow placement="bottom" size="md" variant="outlined"
                             title={"First Author"} >
                        <Chip color={"primary"}>%A</Chip>
                    </Tooltip>
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}