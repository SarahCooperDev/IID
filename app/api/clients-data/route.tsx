import { GetAllClients } from '@/lib/ClientController';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse, NextRequest } from "next/server";
 
type ResponseData = {
  message: string
}

export function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    console.log("Hit api");
    console.log("Method is:", req.method);
    //let data = await GetAllCharges();

    if(req.method === "POST"){
        res.status(200).json({ message: 'Hello from Next.js!' })
    } else if(req.method === "GET"){
        res.status(200).json({ message: 'Hello from Next.js!' })
    }
  }

  export async function GET(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
    console.log("Hit get api");
    
    let data = await GetAllClients();

    return NextResponse.json(data, {
      status: 200,
    });
  }