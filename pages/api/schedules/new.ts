import { parse } from "date-fns";
import { withIronSessionApiRoute } from "iron-session/next/dist";
import { NextApiRequest, NextApiResponse } from "next";
import { format } from "util";
import { ScheduleSession } from "../../../types/ScheduleSession";
import { sessionOptions } from "../../../utils/session";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const schedule = {
      scheduleAt: format(parse(req.body.scheduleAt, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd'),
    } as ScheduleSession;

    req.session.schedule = schedule;

    await req.session.save();

    res.status(200).json(req.session.schedule);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions );
