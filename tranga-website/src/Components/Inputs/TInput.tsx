import { Button, Input } from '@mui/joy';
import { MouseEventHandler, useEffect, useState } from 'react';
import * as React from 'react';
import TProps, { TColor, TDisabled, TState } from './TProps.ts';
import './loadingBorder.css';

export default function TInput(props: TInputProps) {
    const [state, setState] = useState<TState>(TState.clean);
    const [value, setValue] = useState<string | number | readonly string[] | undefined>(
        props.defaultValue
    );
    const [initialValue, setInitialValue] = useState<
        string | number | readonly string[] | undefined
    >(props.defaultValue);

    const timerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

    const inputValueChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setValue(e.target.value);
        clearTimeout(timerRef.current);

        if (!props.autoSubmit) return;

        timerRef.current = setTimeout(() => {
            submit();
        }, props.actionDelay ?? 1500);
    };

    const submitClicked: MouseEventHandler<HTMLAnchorElement> = (e) => {
        e.preventDefault();
        submit();
    };

    const keyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') submit();
    };

    const submit = () => {
        setState(TState.busy);
        clearTimeout(timerRef.current);
        if (props.completionAction)
            props
                .completionAction(value)
                .then(() => {
                    setState(TState.success);
                    setInitialValue(value);
                })
                .catch(() => setState(TState.failure));
    };

    useEffect(() => {
        if (value == initialValue) {
            setState(TState.clean);
        }
    }, [value, initialValue]);

    return (
        <Input
            color={TColor(state)}
            disabled={props.disabled ?? TDisabled(state)}
            aria-disabled={props.disabled ?? TDisabled(state)}
            placeholder={props.placeholder}
            value={value}
            onChange={inputValueChanged}
            onKeyDown={keyDownHandler}
            className={'t-loadable'}
            endDecorator={
                props.submitButtonHidden ? null : (
                    <Button
                        onClick={submitClicked}
                        disabled={props.disabled ?? TDisabled(state)}
                        aria-disabled={props.disabled ?? TDisabled(state)}
                        className={'t-loadable'}>
                        {props.submitButtonText ?? 'Submit'}
                    </Button>
                )
            }
        />
    );
}

export interface TInputProps extends TProps {
    placeholder?: string;
    defaultValue?: string | number | readonly string[];
    actionDelay?: number;
    autoSubmit?: boolean;
    submitButtonHidden?: boolean;
    submitButtonText?: string;
}
