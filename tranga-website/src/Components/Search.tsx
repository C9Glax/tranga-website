import {
  Dispatch,
  KeyboardEventHandler,
  ReactNode,
  useContext,
  useState,
} from "react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardCover,
  Chip,
  Input,
  Modal,
  ModalDialog,
  Option,
  Select,
  Step,
  StepIndicator,
  Stepper,
  Typography,
} from "@mui/joy";
import ModalClose from "@mui/joy/ModalClose";
import { MangaConnectorContext } from "../App.tsx";
import { MangaConnector, MinimalManga } from "../apiClient/data-contracts.ts";
import MangaList from "./Mangas/MangaList.tsx";
import { ApiContext } from "../apiClient/ApiContext.tsx";
import { LoadingState, StateColor, StateIndicator } from "./Loading.tsx";

export default function (): ReactNode {
  const [open, setOpen] = useState(false);

  return (
    <Badge badgeContent={"+"}>
      <Card
        onClick={() => {
          if (!open) setOpen(true);
        }}
        className={"manga-card"}
      >
        <CardCover className={"manga-cover"}>
          <img src={"/blahaj.png"} />
        </CardCover>
        <CardCover className={"manga-cover-blur"} />
        <CardContent>Add</CardContent>
        <CardContent>
          <SearchDialog open={open} setOpen={setOpen} />
        </CardContent>
      </Card>
    </Badge>
  );
}

function SearchDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<boolean>;
}): ReactNode {
  const mangaConnectors = useContext(MangaConnectorContext);
  const Api = useContext(ApiContext);

  const [selectedMangaConnector, setSelectedMangaConnector] = useState<
    MangaConnector | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState<string>();
  const [searchResults, setSearchResults] = useState<MinimalManga[]>([]);

  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.none,
  );

  const doTheSearch = () => {
    if (searchTerm === undefined || searchTerm.length < 1) return;
    if (!isUrl(searchTerm) && selectedMangaConnector === undefined) return;

    setLoadingState(LoadingState.loading);

    if (isUrl(searchTerm))
      Api.searchUrlCreate(searchTerm)
        .then((response) => {
          if (response.ok) {
            setSearchResults([response.data]);
            setLoadingState(LoadingState.success);
          } else setLoadingState(LoadingState.failure);
        })
        .catch(() => setLoadingState(LoadingState.failure));
    else
      Api.searchDetail(selectedMangaConnector!.name, searchTerm)
        .then((response) => {
          if (response.ok) {
            setSearchResults(response.data);
            setLoadingState(LoadingState.success);
          } else setLoadingState(LoadingState.failure);
        })
        .catch(() => setLoadingState(LoadingState.failure));
  };

  const isUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const keyDownCheck: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      doTheSearch();
    }
  };

  return (
    <Modal
      sx={{ width: "100%", height: "100%" }}
      open={open}
      onClose={() => setOpen(false)}
    >
      <ModalDialog sx={{ width: "80%" }}>
        <ModalClose />
        <Stepper orientation={"vertical"}>
          <Step indicator={<StepIndicator>1</StepIndicator>}>
            <Typography>Connector</Typography>
            <Select
              disabled={loadingState == LoadingState.loading}
              onChange={(_, v) =>
                setSelectedMangaConnector(v as MangaConnector)
              }
            >
              {mangaConnectors?.map((con) => (
                <Option value={con}>
                  <Typography>
                    <img
                      src={con.iconUrl}
                      style={{ maxHeight: "var(--Icon-fontSize)" }}
                    />
                    {con.name}
                  </Typography>
                </Option>
              ))}
            </Select>
          </Step>
          <Step indicator={<StepIndicator>2</StepIndicator>}>
            <Typography>Search</Typography>
            <Input
              disabled={loadingState == LoadingState.loading}
              onKeyDown={keyDownCheck}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              endDecorator={
                <Button
                  disabled={loadingState == LoadingState.loading}
                  onClick={doTheSearch}
                  endDecorator={StateIndicator(loadingState)}
                  color={StateColor(loadingState)}
                >
                  Search
                </Button>
              }
            />
          </Step>
          <Step indicator={<StepIndicator>3</StepIndicator>}>
            <Typography>
              Result <Chip>{searchResults.length}</Chip>
            </Typography>
            <MangaList manga={searchResults} />
          </Step>
        </Stepper>
      </ModalDialog>
    </Modal>
  );
}
