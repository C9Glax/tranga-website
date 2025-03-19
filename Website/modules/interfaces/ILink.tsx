import React, {ReactElement, useEffect} from "react";
import {getData} from "../../App";

export default interface ILink {
    linkId: string;
    linkProvider: string;
    linkUrl: string;
}

export function LinkElement({apiUri, linkId} : {apiUri: string, linkId: string | null}) : ReactElement{
    let [link, setLink] = React.useState<ILink | null>(null);

    useEffect(()=> {
        if(linkId === null)
            return;
        getData(`${apiUri}/v2/Query/Link/${linkId}`)
            .then((json) => {
                let ret = json as ILink;
                setLink(ret);
            });
    }, [])

    return (<a className="Manga-Link-Value" href={link ? link.linkUrl : "#"}>{link ? link.linkProvider : linkId}</a>);
}