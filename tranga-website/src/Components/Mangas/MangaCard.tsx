import {
  Badge,
  Box,
  Card,
  CardContent,
  CardCover,
  Chip,
  Link,
  Modal,
  ModalDialog,
  Stack,
  Tooltip,
  Typography,
} from "@mui/joy";
import { Manga, MinimalManga } from "../../apiClient/data-contracts.ts";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import "./MangaCard.css";
import MangaConnectorBadge from "./MangaConnectorBadge.tsx";
import ModalClose from "@mui/joy/ModalClose";
import { ApiContext } from "../../apiClient/ApiContext.tsx";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { MangaContext } from "../../App.tsx";
import { MangaConnectorLinkFromId } from "../MangaConnectorLink.tsx";

export function MangaCard({
  manga,
  children,
}: {
  manga: MinimalManga | undefined;
  children?: ReactNode;
}) {
  if (manga === undefined) return PlaceHolderCard();

  const [open, setOpen] = useState(false);

  return (
    <MangaConnectorBadge manga={manga}>
      <Card className={"manga-card"} onClick={() => setOpen(true)}>
        <CardCover className={"manga-cover"}>
          <MangaCover mangaId={manga?.key} />
        </CardCover>
        <CardCover className={"manga-cover-blur"} />
        <CardContent className={"manga-content"}>
          <Typography level={"title-lg"}>{manga?.name}</Typography>
        </CardContent>
      </Card>
      <MangaModal minimalManga={manga} open={open} setOpen={setOpen}>
        {children}
      </MangaModal>
    </MangaConnectorBadge>
  );
}

export function MangaModal({
  minimalManga,
  open,
  setOpen,
  children,
}: {
  minimalManga: MinimalManga;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
}) {
  const { getManga } = useContext(MangaContext);
  const [manga, setManga] = useState<Manga>();
  useEffect(() => {
    getManga(minimalManga.key).then(setManga);
  }, []);

  return (
    <Modal open={open} onClose={() => setOpen(false)} className={"manga-modal"}>
      <ModalDialog style={{ width: "100%" }}>
        <ModalClose />
        <Tooltip
          title={
            <Stack spacing={1}>
              {manga?.altTitles?.map((title) => (
                <Chip>{title.title}</Chip>
              ))}
            </Stack>
          }
        >
          <Typography level={"h4"} width={"fit-content"}>
            {manga?.name ?? minimalManga.name}
          </Typography>
        </Tooltip>
        <Stack direction={"row"} spacing={2}>
          <Box key={"Cover"} className={"manga-card"}>
            <MangaCover mangaId={minimalManga.key} />
          </Box>
          <Stack
            key={"Description"}
            direction={"column"}
            sx={{ width: "calc(100% - 230px)" }}
          >
            <Stack
              key={"Tags"}
              direction={"row"}
              flexWrap={"wrap"}
              useFlexGap
              spacing={0.5}
            >
              {manga?.mangaConnectorIdsIds?.map((idid) => (
                <MangaConnectorLinkFromId
                  key={idid}
                  MangaConnectorIdId={idid}
                />
              ))}
              {manga?.mangaTags?.map((tag) => (
                <Chip key={tag.tag}>{tag.tag}</Chip>
              ))}
              {manga?.links?.map((link) => (
                <Chip key={link.key}>
                  <Link href={link.linkUrl}>{link.linkProvider}</Link>
                </Chip>
              ))}
            </Stack>
            <Box sx={{ flexGrow: 1 }}>
              <MarkdownPreview
                source={manga?.description ?? "Loading..."}
                style={{
                  background: "transparent",
                  maxHeight: "50vh",
                  overflowY: "auto",
                }}
              />
            </Box>
            <Stack
              sx={{ justifySelf: "flex-end", alignSelf: "flex-end" }}
              spacing={2}
              direction={"row"}
            >
              {manga ? children : null}
            </Stack>
          </Stack>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}

function PlaceHolderCard() {
  return (
    <Badge>
      <Card className={"manga-card"}>
        <CardCover className={"manga-cover"}>
          <img src={"/blahaj.png"} />
        </CardCover>
        <CardCover className={"manga-cover-blur"} />
      </Card>
    </Badge>
  );
}

function MangaCover({ mangaId }: { mangaId?: string }) {
  const api = useContext(ApiContext);
  const uri = mangaId
    ? `${api.baseUrl}/v2/Manga/${mangaId}/Cover`
    : "blahaj.png";

  return (
    <img
      src={uri}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "var(--CardCover-radius)",
      }}
    />
  );
}
