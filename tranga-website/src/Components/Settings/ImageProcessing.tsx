import IBackendSettings from "../../api/types/IBackendSettings.ts";
import {useCallback, useContext, useState} from "react";
import {ApiUriContext} from "../../api/fetchApi.tsx";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    ColorPaletteProp,
    Input,
    Switch,
    Typography
} from "@mui/joy";
import * as React from "react";
import {UpdateBWImageToggle, UpdateImageCompressionValue} from "../../api/BackendSettings.tsx";

export default function ImageProcessing({backendSettings}: {backendSettings?: IBackendSettings}) {
    const apiUri = useContext(ApiUriContext);

    const [loadingBw, setLoadingBw] = useState<boolean>(false);
    const [bwInputColor, setBwInputcolor] = useState<ColorPaletteProp>("neutral");

    const timerRefBw = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const bwChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        setBwInputcolor("warning");
        clearTimeout(timerRefBw.current);
        console.log(e);
        timerRefBw.current = setTimeout(() => {
            UpdateBw(e.target.checked);
        }, 1000);
    }

    const UpdateBw = useCallback((value: boolean) => {
        UpdateBWImageToggle(apiUri, value)
            .then(() => setBwInputcolor("success"))
            .catch(() => setBwInputcolor("danger"))
            .finally(() => setLoadingBw(false));
    }, [apiUri]);

    const [loadingCompression, setLoadingCompression] = useState<boolean>(false);
    const [compressionInputColor, setCompressionInputColor] = useState<ColorPaletteProp>("neutral");
    const [compressionEnabled, setCompressionEnabled] = useState<boolean>((backendSettings?.compression??100) < 100);
    const [compressionValue, setCompressionValue] = useState<number|undefined>(backendSettings?.compression);

    const timerRefCompression = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const compressionLevelChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        setCompressionInputColor("warning");
        setCompressionValue(Number.parseInt(e.target.value));
        clearTimeout(timerRefCompression.current);

        console.log(e);
        timerRefCompression.current = setTimeout(() => {
            UpdateCompressionLevel(Number.parseInt(e.target.value));
        }, 1000);
    }

    const compressionEnableChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        setCompressionInputColor("warning");
        setCompressionEnabled(e.target.checked);
        clearTimeout(timerRefCompression.current);
        timerRefCompression.current = setTimeout(() => {
            UpdateCompressionLevel(e.target.checked ? compressionValue! : 100);
        }, 1000);
    }

    const UpdateCompressionLevel = useCallback((value: number)=> {
        setLoadingCompression(true);
        UpdateImageCompressionValue(apiUri, value)
            .then(() => {
                setCompressionInputColor("success");
                setCompressionValue(value);
            })
            .catch(() => setCompressionInputColor("danger"))
            .finally(() => setLoadingCompression(false));
    }, [apiUri]);

    return (
        <Accordion>
            <AccordionSummary>Image Processing</AccordionSummary>
            <AccordionDetails>
                <Typography endDecorator={
                    <Switch disabled={backendSettings === undefined || loadingBw}
                            onChange={bwChanged}
                            color={bwInputColor}
                            defaultChecked={backendSettings?.bwImages} />
                }>
                    Black and White Images
                </Typography>
                <Typography endDecorator={
                    <Switch disabled={backendSettings === undefined || loadingCompression}
                            onChange={compressionEnableChanged}
                            color={compressionInputColor}
                            defaultChecked={compressionEnabled} endDecorator={
                        <Input
                            defaultValue={backendSettings?.compression}
                            disabled={!compressionEnabled || loadingCompression}
                            onChange={compressionLevelChanged}
                            color={compressionInputColor}
                            onKeyDown={(e) => {
                                if(e.key === "Enter") {
                                    clearTimeout(timerRefCompression.current);
                                    // @ts-ignore
                                    UpdateCompressionLevel(Number.parseInt(e.target.value));
                                }
                            }}
                            sx={{width:"70px"}}
                        />
                    } />
                }>
                    Image Compression
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
}