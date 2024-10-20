export default interface IProgressToken{
    cancellationRequested: boolean;
    increments: number;
    incrementsCompleted: number;
    progress: number;
    lastUpdate: Date;
    executionStarted: Date;
    timeRemaining: string;
    state: number;
}

export function GetProgressStateFromNumber(n: number): string {
    switch (n){
        case 0: return "Running";
        case 1: return "Complete";
        case 2: return "Standby";
        case 3: return "Cancelled";
        case 4: return "Waiting";
    }
    return "";
}