import { GetChargesForClient } from '@/lib/ChargeController';
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

  export async function GET(req: NextApiRequest, context: { params: { id: string } }, res: NextApiResponse<ResponseData>) {
    console.log("Hit get client-data/charges api");
    
    const clientId = context.params.id;    
    console.log(clientId);

    let data = await GetChargesForClient(clientId);

    return NextResponse.json(data, {
      status: 200,
    });
  }