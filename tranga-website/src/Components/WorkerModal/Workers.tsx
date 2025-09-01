import { Dispatch, ReactNode, useContext, useEffect, useState } from "react";
import Drawer from "@mui/joy/Drawer";
import { Button, Option, Select, Table } from "@mui/joy";
import { BaseWorker } from "../../apiClient/data-contracts.ts";
import ModalClose from "@mui/joy/ModalClose";
import { ApiContext } from "../../apiClient/ApiContext.tsx";

export default function (): ReactNode {
  const [open, setOpen] = useState(false);

  const [workers, setWorkers] = useState<BaseWorker[]>([]);
  const Api = useContext(ApiContext);

  useEffect(() => {
    Api.workerList().then((response) => {
      if (response.ok) {
        setWorkers(response.data);
      }
    });
  }, [Api]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Workers</Button>
      <WorkerDrawer open={open} setOpen={setOpen} workers={workers} />
    </>
  );
}

function WorkerDrawer({
  open,
  setOpen,
  workers,
}: {
  open: boolean;
  setOpen: Dispatch<boolean>;
  workers: BaseWorker[];
}): ReactNode {
  return (
    <Drawer open={open} onClose={() => setOpen(false)} size={"lg"}>
      <ModalClose />
      <Table
        borderAxis="bothBetween"
        size="md"
        stickyFooter={false}
        stickyHeader
      >
        <thead>
          <tr>
            <th>Key</th>
            <th>Can run</th>
            <th>Missing dependencies</th>
          </tr>
        </thead>
        <tbody>
          {workers.map((worker) => {
            return (
              <tr key={worker.key}>
                <td>{worker.key}</td>
                <td>{worker.allDependenciesFulfilled ? "yes" : "no"}</td>
                <td>
                  <Select placeholder={"Missing dependencies"}>
                    {worker.missingDependencies?.map((worker) => {
                      return <Option value={worker.key}>{worker.key}</Option>;
                    })}
                  </Select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Drawer>
  );
}
