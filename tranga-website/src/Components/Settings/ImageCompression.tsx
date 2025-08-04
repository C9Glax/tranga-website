import {ReactNode, useContext} from "react";
import {SettingsContext} from "./Settings.tsx";
import {Card, Slider, Typography} from "@mui/joy";

export default function () : ReactNode {
    const settings = useContext(SettingsContext);
    
    return (
        <Card>
            <Typography>Image Compression</Typography>
            <Slider sx={{marginTop: "20px"}} valueLabelDisplay={"auto"} defaultValue={settings?.imageCompression}></Slider>
        </Card>
    );
}