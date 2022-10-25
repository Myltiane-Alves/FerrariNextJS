// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import { sessionOptions } from '../../../utils/session'
import axios from 'axios'

type Data = {
  token: string
}

export default withIronSessionApiRoute(async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {

  try {

      const {data: { token }} = await axios.post(`/auth/login`, req.body, {
        baseURL: process.env.API_URL,
      })

      req.session.token = token;
      await req.session.save();

      res.status(200).json({ token })


    } catch (error: any) {

      res.status(400).send(error.response.data)
  }


}, sessionOptions)
