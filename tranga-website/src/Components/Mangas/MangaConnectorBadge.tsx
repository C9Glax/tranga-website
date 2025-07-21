import { Badge } from "@mui/joy";
import {Manga, MangaConnector} from "../../apiClient/data-contracts.ts";
import {ReactElement, useContext, useEffect, useState} from "react";
import {MangaConnectorContext} from "../../App.tsx";
import "./MangaCard.css"

export default function MangaConnectorBadge ({manga, children} : {manga: Manga, children? : ReactElement<any, any> | ReactElement<any,any>[] | undefined}) {
    const context = useContext(MangaConnectorContext);
    const [connectors, setConnectors] = useState<MangaConnector[]>([]);
    
    useEffect(() => {
        if (context)
            setConnectors(context.filter(con => Object.keys(manga.idsOnMangaConnectors??[]).find(name => con.name == name)));
    }, []);
    
    return (
        <Badge badgeContent={connectors?.map(connector => <img key={connector.name} src={connector.iconUrl} className={"manga-card-badge-icon"} />)}>
            {children}
        </Badge>
    );
}