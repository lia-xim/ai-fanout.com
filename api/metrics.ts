import type { VercelRequest, VercelResponse } from "@vercel/node";
import { incrementMetric, metricEvents } from "../src/server/metrics.mjs";

export default async function handler(req:VercelRequest,res:VercelResponse){
  if(req.method!=="POST")return res.status(405).setHeader("Allow","POST").json({error:"Method not allowed"});
  const event=typeof req.body?.event==="string"?req.body.event:"";
  const provider=typeof req.body?.provider==="string"?req.body.provider:"all";
  if(!metricEvents.has(event))return res.status(400).json({error:"Unknown event"});
  await incrementMetric(event,{provider});
  res.setHeader("Cache-Control","no-store");
  return res.status(204).end();
}
