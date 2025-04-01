import IBackendSettings from "../../api/types/IBackendSettings.ts";
import {useCallback, useContext, useState} from "react";
import {ApiUriContext} from "../../api/fetchApi.tsx";
import {Accordion, AccordionDetails, AccordionSummary, ColorPaletteProp, Input, Stack, Typography} from "@mui/joy";
import {RequestLimitType} from "../../api/types/EnumRequestLimitType.ts";
import {UpdateRequestLimit} from "../../api/BackendSettings.tsx";

export default function RequestLimits({backendSettings}: {backendSettings?: IBackendSettings}) {
    const apiUri = useContext(ApiUriContext);

    const [color, setColor] = useState<ColorPaletteProp>("neutral");
    const [loading, setLoading] = useState(false);
    const Update = useCallback((target: HTMLInputElement, limit : RequestLimitType) => {
        setLoading(true);
        UpdateRequestLimit(apiUri, limit, Number.parseInt(target.value))
            .then(() => setColor("success"))
            .catch(() => setColor("danger"))
            .finally(() => setLoading(false));
    },[apiUri])

    return (
        <Accordion>
            <AccordionSummary>Request Limits</AccordionSummary>
            <AccordionDetails>
                <Stack spacing={1} direction="column">
                    <Input slotProps={{input: {min: 0, max: 360}}} color={color} startDecorator={<Typography>Default</Typography>} disabled={loading} type={"number"} defaultValue={backendSettings?.requestLimits.Default} placeholder={"Default"} required onKeyDown={(e) => { if(e.key == "Enter") Update(e.target as HTMLInputElement, RequestLimitType.Default);}} />
                    <Input slotProps={{input: {min: 0, max: 360}}} color={color} startDecorator={<Typography>Image</Typography>} disabled={loading} type={"number"} defaultValue={backendSettings?.requestLimits.MangaImage} placeholder={"MangaImage"} required onKeyDown={(e) => { if(e.key == "Enter") Update(e.target as HTMLInputElement, RequestLimitType.MangaImage);}} />
                    <Input slotProps={{input: {min: 0, max: 360}}} color={color} startDecorator={<Typography>Info</Typography>} disabled={loading} type={"number"} defaultValue={backendSettings?.requestLimits.MangaInfo} placeholder={"MangaInfo"} required onKeyDown={(e) => { if(e.key == "Enter") Update(e.target as HTMLInputElement, RequestLimitType.MangaInfo);}} />
                    <Input slotProps={{input: {min: 0, max: 360}}} color={color} startDecorator={<Typography>Image</Typography>} endDecorator={<img src={"https://mangadex.org/favicon.ico"} />} disabled={loading} type={"number"} defaultValue={backendSettings?.requestLimits.MangaDexImage} placeholder={"MangaDexImage"} required onKeyDown={(e) => { if(e.key == "Enter") Update(e.target as HTMLInputElement, RequestLimitType.MangaDexImage);}} />
                    <Input slotProps={{input: {min: 0, max: 360}}} color={color} startDecorator={<Typography>Feed</Typography>} endDecorator={<img src={"https://mangadex.org/favicon.ico"} />} disabled={loading} type={"number"} defaultValue={backendSettings?.requestLimits.MangaDexFeed} placeholder={"MangaDexFeed"} required onKeyDown={(e) => { if(e.key == "Enter") Update(e.target as HTMLInputElement, RequestLimitType.MangaDexFeed);}} />
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}