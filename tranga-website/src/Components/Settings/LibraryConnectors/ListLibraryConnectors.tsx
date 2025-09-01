import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../../apiClient/ApiContext.tsx";
import { LibraryConnector } from "../../../apiClient/data-contracts.ts";
import { Card, Chip, Input, Stack } from "@mui/joy";

export default function () {
  const Api = useContext(ApiContext);
  const [libraryConnectors, setLibraryConnectors] = useState<
    LibraryConnector[]
  >([]);

  useEffect(() => {
    getConnectors();
  }, []);

  const getConnectors = () => {
    Api.libraryConnectorList().then((r) => {
      if (r.ok) setLibraryConnectors(r.data);
    });
  };

  return (
    <Stack direction={"column"} spacing={1}>
      {libraryConnectors.map((c) => (
        <LibraryConnectorItem key={c.key} connector={c} />
      ))}
    </Stack>
  );
}

function LibraryConnectorItem({ connector }: { connector: LibraryConnector }) {
  return (
    <Card>
      <Chip>{connector.libraryType}</Chip>
      <Input disabled value={connector.baseUrl} />
    </Card>
  );
}
