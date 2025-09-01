import { Badge } from "@mui/joy";
import { MinimalManga } from "../../apiClient/data-contracts.ts";
import { ReactNode } from "react";
import "./MangaCard.css";
import MangaConnectorLink from "../MangaConnectorLink.tsx";

export default function MangaConnectorBadge({
  manga,
  children,
}: {
  manga: MinimalManga;
  children?: ReactNode;
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
