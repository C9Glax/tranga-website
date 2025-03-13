import React, {ReactElement, useEffect} from "react";
import {getData} from "../../App";

export default interface IAuthor {
    authorId: string;
    authorName: string;
}

export function AuthorElement({apiUri, authorId} : {apiUri: string, authorId: string}) : ReactElement{
    let [name, setName] = React.useState<string>(authorId);

    useEffect(()=> {
        getData(`${apiUri}/v2/Query/Author/${authorId}`)
            .then((json) => {
                let ret = json as IAuthor;
                setName(ret.authorName);
            });
    }, [])

    return (<span>{name}</span>);
}