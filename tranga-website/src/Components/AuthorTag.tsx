import {Chip, ColorPaletteProp, Skeleton} from "@mui/joy";
import {useContext, useEffect, useState} from "react";
import {ApiUriContext} from "../api/fetchApi.tsx";
import IAuthor from "../api/types/IAuthor.ts";
import {GetAuthor} from "../api/Query.tsx";

export default function AuthorTag({authorId, color} : { authorId: string | undefined, color?: ColorPaletteProp }) {
    const useAuthor = authorId ?? "AuthorId";
    const apiUri = useContext(ApiUriContext);

    const [author, setAuthor] = useState<IAuthor>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        GetAuthor(apiUri, useAuthor).then(setAuthor).finally(() => setLoading(false));
    }, [authorId]);

    return (
        <Chip variant={"outlined"} size={"md"} color={color??"primary"}>
            <Skeleton variant={"text"} loading={loading}>{author?.authorName ?? "Load Failed"}</Skeleton>
        </Chip>
    );
}