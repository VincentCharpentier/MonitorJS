interface MonitorRecord
{
    call_count: number;
    name: string;
    total_time: number;
}

interface MonitorIdentifier
{
    name: string;
    id: number;
}

interface MonitorStatic
{
    Cancel(input?: string | MonitorIdentifier): void;
    Clear(blockName: string): void;
    ClearAll(): void;
    Get(blockName: string): MonitorRecord;
    GetAll(): Array<MonitorRecord>;
    Start(blockName?: string): MonitorIdentifier;
    Stop(input?: string | MonitorIdentifier): void;
}

declare var Monitor: MonitorStatic;
