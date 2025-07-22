import {Button} from "@mui/joy";
import {SettingsItem} from "./Settings.tsx";
import {useContext, useState} from "react";
import {ApiContext} from "../../apiClient/ApiContext.tsx";
import {LoadingState, StateColor, StateIndicator} from "../Loading.tsx";

export default function () {
    const Api = useContext(ApiContext);
    
    const [unusedMangaState, setUnusedMangaState] = useState(LoadingState.none);
    const cleanUnusedManga = () => {
        setUnusedMangaState(LoadingState.loading);
        Api.maintenanceCleanupNoDownloadMangaCreate()
            .then(r => {
                if (r.ok)
                    setUnusedMangaState(LoadingState.success);
                else
                    setUnusedMangaState(LoadingState.failure);
            }).catch(_ => setUnusedMangaState(LoadingState.failure));
    }
    
    
    return (

        <SettingsItem title={"Maintenance"}>
            <Button
                disabled={unusedMangaState == LoadingState.loading}
                color={StateColor(unusedMangaState)}
                endDecorator={StateIndicator(unusedMangaState)}
                onClick={cleanUnusedManga}>Cleanup unused Manga</Button>
        </SettingsItem>
    );
}