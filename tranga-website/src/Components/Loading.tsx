import { Close, Done } from "@mui/icons-material";
import { CircularProgress, ColorPaletteProp } from "@mui/joy";
import { ReactNode } from "react";

export enum LoadingState {
  none,
  loading,
  success,
  failure,
}

export function StateIndicator(state: LoadingState): ReactNode {
  switch (state) {
    case LoadingState.loading:
      return <CircularProgress />;
    case LoadingState.failure:
      return <Close />;
    case LoadingState.success:
      return <Done />;
    default:
      return null;
  }
}

export function StateColor(state: LoadingState): ColorPaletteProp | undefined {
  switch (state) {
    case LoadingState.failure:
      return "danger";
    case LoadingState.success:
      return "success";
    default:
      return undefined;
  }
}
