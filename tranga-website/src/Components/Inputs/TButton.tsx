import { Button } from '@mui/joy'
import TProps, { TColor, TDisabled, TState } from './TProps.ts'
import { MouseEventHandler, ReactNode, useState } from 'react'

export default function TButton(props: TButtonProps) {
    const [state, setState] = useState<TState>(TState.clean)

    const clicked: MouseEventHandler<HTMLAnchorElement> = (e) => {
        setState(TState.busy)
        e.preventDefault()
        if (props.completionAction)
            props
                .completionAction(undefined)
                .then(() => setState(TState.success))
                .catch(() => setState(TState.failure))
    }

    return (
        <Button
            color={TColor(state)}
            disabled={props.disabled ?? TDisabled(state)}
            aria-disabled={props.disabled ?? TDisabled(state)}
            onClick={clicked}
            className={'t-loadable'}
        >
            {props.children}
        </Button>
    )
}

export interface TButtonProps extends TProps {
    children?: ReactNode
}
