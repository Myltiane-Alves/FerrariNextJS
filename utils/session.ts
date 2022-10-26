import { IronSessionOptions } from "iron-session";
import { ScheduleSession } from "../types/ScheduleSession";

export const sessionOptions: IronSessionOptions = {
  password: String(process.env.SECRET_COOKIE_PASSWORD),
  cookieName: 'ferrari-lab/iron-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production'
  }
}

declare module 'iron-session' {
  interface IronSessionData {
    schedule?: ScheduleSession;
  }
}
