import {Modal, ModalDialog, Tab, TabList, Tabs} from "@mui/joy";
import ModalClose from "@mui/joy/ModalClose";
import * as React from "react";

export default function ({open, setOpen} : {open: boolean, setOpen: Dispatch<boolean>}) {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog>
                <ModalClose />
                <Tabs sx={{width:'95%'}} defaultValue={"komga"}>
                    <TabList>
                        <Tab value={"komga"}>Komga</Tab>
                        <Tab value={"kavita"}>Kavita</Tab>
                    </TabList>
                </Tabs>
            </ModalDialog>
        </Modal>
    );
}