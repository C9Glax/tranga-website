import React, {ReactElement, useEffect} from "react";
import {getData} from "../../App";
import IAuthor from "./IAuthor";

export default interface IMangaAltTitle {
    altTitleId: string;
    language: string;
    title: string;
}

export function AltTitleElement({apiUri, altTitleId} : {apiUri: string, altTitleId: string | null}) : ReactElement{
    let [altTitle, setAltTitle] = React.useState<IMangaAltTitle | null>(null);

    useEffect(()=> {
        if(altTitleId === null)
            return;
        getData(`${apiUri}/v2/Query/AltTitle/${altTitleId}`)
            .then((json) => {
                let ret = json as IMangaAltTitle;
                setAltTitle(ret);
            });
    }, [])

    return (<span className="Manga-AltTitle">{altTitle ? altTitle.title : altTitleId}</span>);
}