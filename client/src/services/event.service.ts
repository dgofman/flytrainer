import { Injectable, EventEmitter } from '@angular/core';

export enum EventType {
    Load,
    New,
    Add,
    Update,
    Delete,
    Refresh
}

export interface EmitEvent {
    message: EventType;
    data: any;
}

@Injectable()
export class EventService {

    emmiter: EventEmitter<any> = new EventEmitter<any>();

    public emit(message: EventType, data: any): void {
        this.emmiter.emit({ message, data } as EmitEvent);
    }
}
