interface MonitorRecord
{
    call_count: number;
    name: string;
    total_time: number;
}

interface MonitorStatic
{
    Cancel(recordName?: string): void;
    Clear(recordName: string): void;
    ClearAll(): void;
    Get(recordName: string): MonitorRecord;
    GetAll(): Array<MonitorRecord>;
    Start(recordName?: string): void;
    Stop(recordName?: string): void;
}

declare var Monitor: MonitorStatic;
