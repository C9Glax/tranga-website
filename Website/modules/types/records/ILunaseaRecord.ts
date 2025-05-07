import {ReactElement, useState} from "react";
import NotificationConnector from "../../api/NotificationConnector";
import Loader from "../../Loader";
import "../../../styles/notificationConnector.css";

export default interface ILunaseaRecord {
    id: string;
}