import React, {ReactElement, useEffect} from "react";
import {getData} from "../../App";

export default interface IAuthor {
    authorId: string;
    authorName: string;
}

export function AuthorElement({apiUri, authorId} : {apiUri: string, authorId: string | null}) : ReactElement{
    let [author, setAuthor] = React.useState<IAuthor | null>(null);

    useEffect(()=> {
        if(authorId === null)
            return;
        getData(`${apiUri}/v2/Query/Author/${authorId}`)
            .then((json) => {
                let ret = json as IAuthor;
                setAuthor(ret);
            });
    }, [])

    return (<span className="Manga-Author-Name">{author ? author.authorName : authorId}</span>);
}