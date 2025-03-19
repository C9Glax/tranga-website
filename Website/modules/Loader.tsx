import "../styles/loader.css";
import {CSSProperties} from "react";

export default function Loader({loading, style} : {loading: boolean, style?:CSSProperties|null}) {
    return <span is-loading={loading ? "loading" : "done"} style={style ? style : undefined}></span>
}