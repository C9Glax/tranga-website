import {Chip, Skeleton, Link, ColorPaletteProp} from "@mui/joy";
import {useContext, useEffect, useState} from "react";
import {ApiUriContext} from "../api/fetchApi.tsx";
import {GetLink} from "../api/Query.tsx";
import ILink from "../api/types/ILink.ts";

export default function LinkTag({linkId, color} : { linkId: string | undefined, color?: ColorPaletteProp }) {
    const useLink = linkId ?? "LinkId";
    const apiUri = useContext(ApiUriContext);

    const [link, setLink] = useState<ILink>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        GetLink(apiUri, useLink).then(setLink).finally(() => setLoading(false));
    }, [linkId]);

    return (
        <Chip variant={"outlined"} size={"md"} color={color??"primary"}>
            <Skeleton variant={"text"} loading={loading}>
                <Link href={link?.linkUrl}>{link?.linkProvider??"Load Failed"}</Link>
            </Skeleton>
        </Chip>
    );
}