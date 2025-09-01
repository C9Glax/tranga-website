import { Badge } from "@mui/joy";
import { MinimalManga } from "../../apiClient/data-contracts.ts";
import { ReactElement } from "react";
import "./MangaCard.css";
import MangaConnectorLink from "../MangaConnectorLink.tsx";

export default function MangaConnectorBadge({
  manga,
  children,
}: {
  manga: MinimalManga;
  children?: ReactElement<any, any> | ReactElement<any, any>[] | undefined;
}) {
  return (
    <Badge
      badgeContent={manga.mangaConnectorIds?.map((id) => (
        <MangaConnectorLink key={id.key} MangaConnectorId={id} />
      ))}
    >
      {children}
    </Badge>
  );
}
