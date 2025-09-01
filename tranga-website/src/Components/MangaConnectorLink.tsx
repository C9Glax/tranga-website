import {
  CSSProperties,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ChapterMangaConnectorId,
  MangaConnector,
  MangaMangaConnectorId,
} from "../apiClient/data-contracts.ts";
import { Link, Tooltip, Typography } from "@mui/joy";
import { MangaConnectorContext } from "../App.tsx";
import { ApiContext } from "../apiClient/ApiContext.tsx";

export default function MangaConnectorLink({
  MangaConnectorId,
  imageStyle,
  printName,
}: {
  MangaConnectorId: MangaMangaConnectorId | ChapterMangaConnectorId;
  imageStyle?: CSSProperties;
  printName?: boolean;
}): ReactNode {
  const mangaConnectorContext = useContext(MangaConnectorContext);
  const [mangaConnector, setMangaConnector] = useState<
    MangaConnector | undefined
  >(
    mangaConnectorContext?.find(
      (c) => c.name == MangaConnectorId.mangaConnectorName,
    ),
  );
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const connector = mangaConnectorContext?.find(
      (c) => c.name == MangaConnectorId.mangaConnectorName,
    );
    setMangaConnector(connector);
    if (imageRef?.current != null)
      imageRef.current.setHTMLUnsafe(
        `<img ref=${imageRef} src=${mangaConnector?.iconUrl} style=${imageStyle}/>`,
      );
  }, [MangaConnectorId, imageStyle, mangaConnector, mangaConnectorContext]);

  return (
    <Tooltip
      title={
        <Typography>
          {MangaConnectorId.mangaConnectorName}:{" "}
          <Link href={MangaConnectorId.websiteUrl as string}>
            {MangaConnectorId.websiteUrl}
          </Link>
        </Typography>
      }
    >
      <Link href={MangaConnectorId.websiteUrl as string}>
        <img
          ref={imageRef}
          src={mangaConnector?.iconUrl}
          style={imageStyle}
          className={"manga-card-badge-icon"}
        />
        {printName ? <Typography>{mangaConnector?.name}</Typography> : null}
      </Link>
    </Tooltip>
  );
}

export function MangaConnectorLinkFromId({
  MangaConnectorIdId,
  imageStyle,
  printName,
}: {
  MangaConnectorIdId: string;
  imageStyle?: CSSProperties;
  printName?: boolean;
}): ReactNode {
  const Api = useContext(ApiContext);

  const [node, setNode] = useState<ReactNode>(null);

  useEffect(() => {
    Api.queryMangaMangaConnectorIdDetail(MangaConnectorIdId).then(
      (response) => {
        if (response.ok)
          setNode(
            <MangaConnectorLink
              key={response.data.key}
              MangaConnectorId={response.data}
              imageStyle={{ ...imageStyle, width: "25px" }}
              printName={printName}
            />,
          );
      },
    );
  }, [Api, MangaConnectorIdId, imageStyle, printName]);

  return node;
}
