import IBackendSettings from "../../api/types/IBackendSettings.ts";
import {useCallback, useContext, useState} from "react";
import {ApiUriContext} from "../../api/fetchApi.tsx";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Button,
    ColorPaletteProp,
    Input,
    Stack,
    Typography
} from "@mui/joy";
import {RequestLimitType} from "../../api/types/EnumRequestLimitType.ts";
import {ResetRequestLimit, ResetRequestLimits, UpdateRequestLimit} from "../../api/BackendSettings.tsx";
import {Restore} from "@mui/icons-material";

export default function RequestLimits({backendSettings}: {backendSettings?: IBackendSettings}) {
    const apiUri = useContext(ApiUriContext);

    const [color, setColor] = useState<ColorPaletteProp>("neutral");
    const [loading, setLoading] = useState(false);
    const Update = useCallback((target: HTMLInputElement, limit: RequestLimitType) => {
        setLoading(true);
        UpdateRequestLimit(apiUri, limit, Number.parseInt(target.value))
            .then(() => setColor("success"))
            .catch(() => setColor("danger"))
            .finally(() => setLoading(false));
    },[apiUri])

    const Reset = useCallback((limit: RequestLimitType) => {
        setLoading(true);
        ResetRequestLimit(apiUri, limit)
            .then(() => setColor("success"))
            .catch(() => setColor("danger"))
            .finally(() => setLoading(false));
    }, [apiUri]);

    const ResetAll = useCallback(() => {
        setLoading(true);
        ResetRequestLimits(apiUri)
            .then(() => setColor("success"))
            .catch(() => setColor("danger"))
            .finally(() => setLoading(false));
    }, [apiUri]);

    return (
        <Accordion>
            <AccordionSummary>Request Limits<Button loading={backendSettings === undefined} onClick={ResetAll} size={"sm"} variant={"outlined"} endDecorator={<Restore />}>Reset all</Button></AccordionSummary>
            <AccordionDetails>
                <Stack spacing={1} direction="column">
                    <Item type={RequestLimitType.Default} color={color} backendSettings={backendSettings} loading={loading} Reset={Reset} Update={Update} />
                    <Item type={RequestLimitType.MangaInfo} color={color} backendSettings={backendSettings} loading={loading} Reset={Reset} Update={Update} />
                    <Item type={RequestLimitType.MangaImage} color={color} backendSettings={backendSettings} loading={loading} Reset={Reset} Update={Update} />
                    <Item type={RequestLimitType.MangaDexFeed} color={color} backendSettings={backendSettings} loading={loading} Reset={Reset} Update={Update} />
                    <Item type={RequestLimitType.MangaDexImage} color={color} backendSettings={backendSettings} loading={loading} Reset={Reset} Update={Update} />
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}

function Item({type, color, loading, backendSettings, Reset, Update}:
              {type: RequestLimitType, color: ColorPaletteProp, loading: boolean, backendSettings: IBackendSettings | undefined, Reset: (x: RequestLimitType) => void, Update: (a: HTMLInputElement, x: RequestLimitType) => void}) {
    return (
        <Input slotProps={{input: {min: 0, max: 360}}}
               color={color}
               startDecorator={<Typography sx={{width:"140px"}}>{type}</Typography>}
               endDecorator={<Button onClick={() => Reset(type)}>Reset</Button>}
               disabled={loading} type={"number"}
               defaultValue={backendSettings?.requestLimits[type]}
               placeholder={"Default"}
               required
               onKeyDown={(e) => {
                   if(e.key == "Enter")
                       Update(e.target as HTMLInputElement, type);
               }}
        />
    );
}