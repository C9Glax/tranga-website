import { Checkbox } from '@mui/joy';
import TProps, { TColor, TDisabled, TState } from './TProps.ts';
import { ChangeEvent, ReactNode, useState } from 'react';

export default function TCheckbox(props: TCheckboxProps) {
    const [state, setState] = useState<TState>(TState.clean);

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setState(TState.busy);
        e.preventDefault();
        if (props.onCheckChanged)
            props
                .onCheckChanged(e.target.checked)
                .then(() => setState(TState.success))
                .catch(() => setState(TState.failure));
    };

    return (
        <Checkbox
            color={TColor(state)}
            disabled={props.disabled ?? TDisabled(state)}
            aria-disabled={props.disabled ?? TDisabled(state)}
            onChange={onChange}
            className={'t-loadable'}
            defaultChecked={props.defaultChecked}
            label={props.label}
        />
    );
}

export interface TCheckboxProps extends TProps {
    label?: ReactNode;
    defaultChecked?: boolean;
    onCheckChanged?: (value: boolean) => Promise<void>;
}
