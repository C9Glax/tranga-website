import IBackendSettings from "../../api/types/IBackendSettings.ts";
import {ChangeEvent, useCallback, useContext, useEffect, useRef, useState} from "react";
import {ApiUriContext} from "../../api/fetchApi.tsx";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, ColorPaletteProp, Input, Stack, Switch, Typography,
} from "@mui/joy";
import {
    GetBWImageToggle,
    GetImageCompressionValue,
    UpdateBWImageToggle,
    UpdateImageCompressionValue
} from "../../api/BackendSettings.tsx";

export default function ImageProcessing ({backendSettings}: { backendSettings?: IBackendSettings }) {
    const apiUri = useContext(ApiUriContext);

    useEffect(() => {
        setBwImages(backendSettings?.bwImages??false);
        setCompression(backendSettings?.compression??100);
    }, [backendSettings]);

    const [bwImages, setBwImages] = useState<boolean>(backendSettings?.bwImages??false);
    const [bwImagesLoading, setBwImagesLoading] = useState(false);
    const [bwImagesColor, setBwImagesColor] = useState<ColorPaletteProp>("neutral");
    const bwTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const bwValueChanged = (e : ChangeEvent<HTMLInputElement>) => {
        setBwImages(e.target.checked);
        setBwImagesColor("warning");
        clearTimeout(bwTimerRef.current);
        bwTimerRef.current = setTimeout(() => {
            UpdateBwImages(e.target.checked);
        }, 1000);
    }
    const UpdateBwImages = useCallback((val : boolean) => {
        setBwImagesLoading(true);
        UpdateBWImageToggle(apiUri, val)
            .then(() => GetBWImageToggle(apiUri))
            .then(setBwImages)
            .then(() => setBwImagesColor("success"))
            .catch(() => setBwImagesColor("danger"))
            .finally(() => setBwImagesLoading(false));
    },[apiUri]);

    const [compression, setCompression] = useState<number>(backendSettings?.compression??100);
    const [compressionLoading, setCompressionLoading] = useState(false);
    const [compressionColor, setCompressionColor] = useState<ColorPaletteProp>("neutral");
    const compressionTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const compressionCheckedChanged = (e : ChangeEvent<HTMLInputElement>) => {
        setCompressionColor("warning");
        if(!e.target.checked)
            setCompression(100);
        else
            setCompression(50);
        clearTimeout(compressionTimerRef.current);
        bwTimerRef.current = setTimeout(() => {
            UpdateImageCompression(e.target.checked ? 50 : 100);
        }, 1000);
    }
    const compressionValueChanged = (e : ChangeEvent<HTMLInputElement>) => {
        setCompressionColor("warning");
        setCompression(parseInt(e.target.value));
        clearTimeout(compressionTimerRef.current);
        bwTimerRef.current = setTimeout(() => {
            UpdateImageCompression(parseInt(e.target.value));
        }, 1000);
    }
    const UpdateImageCompression = useCallback((val : number) => {
        setCompressionLoading(true);
        UpdateImageCompressionValue(apiUri, val)
            .then(() => GetImageCompressionValue(apiUri))
            .then(setCompression)
            .then(() => setCompressionColor("success"))
            .catch(() => setCompressionColor("danger"))
            .finally(() => setCompressionLoading(false));
    },[apiUri]);

    return (
        <Accordion>
            <AccordionSummary>Image Processing</AccordionSummary>
            <AccordionDetails>
                <Stack>
                    <Typography endDecorator={
                        <Switch disabled={backendSettings === undefined || bwImagesLoading}
                                onChange={bwValueChanged}
                                color={bwImagesColor}
                                checked={bwImages} />
                    }>B/W Images</Typography>
                    <Typography endDecorator={
                        <Input type={"number"} value={compression} onChange={compressionValueChanged} startDecorator={
                            <Switch disabled={backendSettings === undefined || compressionLoading}
                                    onChange={compressionCheckedChanged}
                                    color={compressionColor}
                                    checked={compression < 100} />
                        } />
                    }>Compression</Typography>
                </Stack>
            </AccordionDetails>
        </Accordion>
    );
}