import { ColorPaletteProp } from '@mui/joy'

export enum TState {
    clean,
    dirty,
    busy,
    success,
    failure,
}

export const TDisabled = (state: TState): boolean => {
    switch (state) {
        case TState.busy:
            return true
        default:
            return false
    }
}

export const TColor = (state: TState): ColorPaletteProp => {
    switch (state) {
        case TState.clean:
            return 'primary'
        case TState.dirty:
            return 'warning'
        case TState.busy:
            return 'neutral'
        case TState.success:
            return 'success'
        case TState.failure:
            return 'warning'
    }
}

export default interface TProps {
    disabled?: boolean
    completionAction?: (
        value?: string | number | readonly string[]
    ) => Promise<void>
}
