import { Schedule } from "./Schedule";
import { ScheduleCreate } from "./ScheduleCreate";

export type ScheduleSession = {
    scheduleAt?: string;
    services?: number[];
    timeOptionId?: number;
    billingAddressId?: number;
    cardFirstSixDigits?: string;
    cardLastFourDigits?: string;
    paymentTypeId?: string;
    // data?: Schedule;

    data:Schedule | null | undefined;
}
