import {ReactNode, useContext, useState} from "react";
import {SettingsContext, SettingsItem} from "./Settings.tsx";
import {ApiContext} from "../../apiClient/ApiContext.tsx";
import {ColorPaletteProp, Input} from "@mui/joy";
import * as React from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";

export default function () : ReactNode {
    const settings = useContext(SettingsContext);
    const Api = useContext(ApiContext);

    const [scheme, setScheme] = useState<ColorPaletteProp>("neutral");
    const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
    const schemeChanged = (e : React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(timerRef.current);
        setScheme("warning");
        timerRef.current = setTimeout(() => {
            Api.settingsChapterNamingSchemePartialUpdate(e.target.value)
                .then(response => {
                    if (response.ok)
                        setScheme("success");
                    else
                        setScheme("danger");
                })
                .catch(() => setScheme("danger"));
        }, 1000);
    }

    return (
        <SettingsItem title={"Chapter Naming Scheme"}>
            <MarkdownPreview style={{backgroundColor: "transparent"}} source={"Placeholders:\n   * %M Obj Name\n   * %V Volume\n   * %C Chapter\n   * %T Title\n   * %A Author (first in list)\n   * %I Chapter Internal ID\n   * %i Obj Internal ID\n   * %Y Year (Obj)\n   *\n   * ?_(...) replace _ with a value from above:\n   * Everything inside the braces will only be added if the value of %_ is not null"} />
            <Input color={scheme} value={settings?.chapterNamingScheme as string} placeholder={"Scheme"} onChange={schemeChanged} />
        </SettingsItem>
    );
}