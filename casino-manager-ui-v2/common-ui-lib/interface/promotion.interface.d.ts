import { Time } from '@angular/common';
import DateTimeFormat = Intl.DateTimeFormat;
export interface Promotion {
    promotionId: number;
    name: string;
    description: string;
    status: string;
    startDtm: Date;
    endDtm: Date;
    startTime: Time;
    endTime: Time;
    prizeIssued: number;
    prizeRemaining: number;
    cancellationTerminationDtm: DateTimeFormat;
    cancellationTerminationBy: string;
    creationTime: Date;
    createdBy: string;
    promotionOccurence: string;
    occurenceFrequency: string;
    promotionDays: string;
    promotionTopology: Array<Object>;
    promotionPrize: Array<Object>;
    totalamount: number;
    percentAmountConsumed: number;
}
