export default interface IProgressToken{
    cancellationRequested: boolean;
    increments: number;
    incrementsCompleted: number;
    progress: number;
    lastUpdate: Date;
    executionStarted: Date;
    timeRemaining: Date;
    state: number;
}