import React, {ReactElement, useEffect} from "react";
import {getData} from "../../App";
import IAuthor from "./IAuthor";

export default interface ILink {
    linkId: string;
    linkProvider: string;
    linkUrl: string;
}

export function LinkElement({apiUri, linkId} : {apiUri: string, linkId: string}) : ReactElement{
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

    return (<a href={linkUrl}>{provider}</a>);
}