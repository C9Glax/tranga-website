import React, {ReactElement, useEffect} from "react";
import {getData} from "../../App";

export default interface ILink {
    linkId: string;
    linkProvider: string;
    linkUrl: string;
}

export function LinkElement({apiUri, linkId} : {apiUri: string, linkId: string | null}) : ReactElement{
    if(linkId === null)
        return (<a className="Manga-Link-Value" href="#">Link</a>);

    let [provider, setProvider] = React.useState<string>(linkId);
    let [linkUrl, setLinkUrl] = React.useState<string>("");

    useEffect(()=> {
        getData(`${apiUri}/v2/Query/Link/${linkId}`)
            .then((json) => {
                let ret = json as ILink;
                setProvider(ret.linkProvider);
                setLinkUrl(ret.linkUrl);
            });
    }, [])

    return (<a className="Manga-Link-Value" href={linkUrl}>{provider}</a>);
}