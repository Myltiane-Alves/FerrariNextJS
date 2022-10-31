import { Schedule } from "./Schedule";

export type ScheduleSession = {
  scheduleAt?: string;
  services?: number[];
  timeOptionId?: number;
  data:Schedule | null | undefined;
}
