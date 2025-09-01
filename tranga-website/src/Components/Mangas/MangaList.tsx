import { ReactNode } from "react";
import { MangaCard } from "./MangaCard.tsx";
import { Stack } from "@mui/joy";
import "./MangaList.css";
import { MinimalManga } from "../../apiClient/data-contracts.ts";
import MangaDownloadDialog from "./MangaDownloadDialog.tsx";
import MangaMerge from "./MangaMerge.tsx";

export default function MangaList({
  manga,
  children,
}: {
  manga: MinimalManga[];
  children?: ReactNode;
}) {
  return (
    <Stack
      className={"manga-list"}
      direction={"row"}
      useFlexGap={true}
      spacing={2}
      flexWrap={"wrap"}
      sx={{
        mx: "calc(-1 * var(--ModalDialog-padding))",
        px: "var(--ModalDialog-padding)",
        overflowY: "scroll",
      }}
    >
      {children}
      {manga?.map((minimalManga) => (
        <MangaCard key={minimalManga.key} manga={minimalManga}>
          <MangaDownloadDialog mangaId={minimalManga.key} />
          <MangaMerge manga={minimalManga} />
        </MangaCard>
      ))}
    </Stack>
  );
}
