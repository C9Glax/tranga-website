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
import { Manga } from "../../apiClient/data-contracts.ts";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import "./MangaCard.css";
import MangaConnectorBadge from "./MangaConnectorBadge.tsx";
import ModalClose from "@mui/joy/ModalClose";
import { ApiContext } from "../../apiClient/ApiContext.tsx";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { MangaContext } from "../../App.tsx";
import { MangaConnectorLinkFromId } from "../MangaConnectorLink.tsx";

export function MangaCardFromId({ mangaId }: { mangaId: string }) {
  const mangas = useContext(MangaContext);
  const manga = mangas.find((manga) => manga.key === mangaId);

  return <MangaCard manga={manga} />;
}

export function MangaCard({
  manga,
  children,
}: {
  manga: Manga | undefined;
  children?: ReactNode;
}) {
  if (manga === undefined) return PlaceHolderCard();

  const [open, setOpen] = useState(false);

  return (
    <MangaConnectorBadge manga={manga}>
      <Card className={"manga-card"} onClick={() => setOpen(true)}>
        <CardCover className={"manga-cover"}>
          <MangaCover manga={manga} />
        </CardCover>
        <CardCover className={"manga-cover-blur"} />
        <CardContent className={"manga-content"}>
          <Typography level={"title-lg"}>{manga?.name}</Typography>
        </CardContent>
      </Card>
      <MangaModal manga={manga} open={open} setOpen={setOpen}>
        {children}
      </MangaModal>
    </MangaConnectorBadge>
  );
}

export function MangaModal({
  manga,
  open,
  setOpen,
  children,
}: {
  manga: Manga | undefined;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
}) {
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
            {manga?.name}
          </Typography>
        </Tooltip>
        <Stack direction={"row"} spacing={2}>
          <Box key={"Cover"} className={"manga-card"}>
            <MangaCover manga={manga} />
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
                source={manga?.description}
                style={{ background: "transparent" }}
              />
            </Box>
            <Stack
              sx={{ justifySelf: "flex-end", alignSelf: "flex-end" }}
              spacing={2}
              direction={"row"}
            >
              {children}
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

function MangaCover({ manga }: { manga: Manga | undefined }) {
  const api = useContext(ApiContext);
  const uri = manga
    ? `${api.baseUrl}/v2/Manga/${manga?.key}/Cover`
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
