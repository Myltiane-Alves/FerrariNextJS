// import { Address } from "./Address";
import { PaymentSituation } from "./PaymentSituation";
// import { Person } from "./Person";
import { ScheduleService } from "./ScheduleService";
import { TimeOption } from "./TimeOption";

export type Schedule = {
	timeOptionId: number;
  billingAddressId: number;
  scheduleAt: string;
  services: number[];
  installments: number;
  cardToken: string;
  paymentMethod: string;
  document: string;


}
