import { Badge } from "@mui/joy";
import {Manga} from "../../apiClient/data-contracts.ts";
import {ReactElement} from "react";
import "./MangaCard.css"
import  {MangaConnectorLinkFromId} from "../MangaConnectorLink.tsx";

export default function MangaConnectorBadge ({manga, children} : {manga: Manga, children? : ReactElement<any, any> | ReactElement<any,any>[] | undefined}) {
   
    return (
        <Badge badgeContent={manga.mangaConnectorIdsIds?.map(id => <MangaConnectorLinkFromId key={id}  MangaConnectorIdId={id} />)}>
            {children}
        </Badge>
    );
}