// import { Address } from "./Address";
import { PaymentSituation } from "./PaymentSituation";
// import { Person } from "./Person";
import { ScheduleService } from "./ScheduleService";
import { TimeOption } from "./TimeOption";

export type Schedule = {
    id: number;
    personId: number;
    timeOptionId: number;
    PaymentSituationId: number;
    billingAddressId: number;
    scheduleAt: string;
    total: number;
    installments: number;
    document: string;
    paymentMethod: string;
    cardToken: string;
    ScheduleService: ScheduleService[];


}
