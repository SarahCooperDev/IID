import { CreateCharge } from '@/lib/ChargeController';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse, NextRequest } from "next/server";
 
type ResponseData = {
  message: string
}

export function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    console.log("Hit api");
    console.log("Method is:", req.method);

    if(req.method === "POST"){
        res.status(200).json({ message: 'Hello from Next.js!' })
    } else if(req.method === "GET"){
        res.status(200).json({ message: 'Hello from Next.js!' })
    }
  }

  export async function POST(req: Request, res: NextApiResponse<ResponseData>) {
    const data = await req.json();
    console.log("In post");
    console.log(`description: ${data.description}`);

    let id = await CreateCharge(data.description, data.category, data.client_id, data.charge_amount, data.service_hours, data.date_of_service);
    return NextResponse.json({chargeId: id}, {status: 200,});
  }