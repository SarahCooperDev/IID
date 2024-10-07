import { CreateCharge, EditCharge, GetAllRecords } from '@/lib/ChargeController';
import { GetChargeWithID } from '../../../../../lib/ChargeController';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse, NextRequest } from "next/server";
import { GetAllClients } from '@/lib/ClientController';

/*
 * api/charges-data/edit/[id]
 */
 
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

  export async function GET(req: NextApiRequest, context: { params: { id: string } }, res: NextApiResponse<ResponseData>) {
    console.log("Hit get charge api");

    const chargeId = context.params.id;

    console.log(`Charge ID: ${chargeId}`);
    
    let chargeData = await GetChargeWithID(chargeId);
    let clientData = await GetAllClients();

    return NextResponse.json({chargeData, clientData}, {
      status: 200,
    });
  }

  export async function POST(req: Request, res: NextApiResponse<ResponseData>) {
    const data = await req.json();
    console.log("In edit charge post");
    console.log(`description: ${data.description}`);
    console.log(`charge_id: ${data.charge_id}`);

    let id = await EditCharge(data.charge_id, data.description, data.category, data.client_id, data.charge_amount, data.service_hours, data.date_of_service);
    return NextResponse.json({chargeId: id}, {status: 200,});
  }