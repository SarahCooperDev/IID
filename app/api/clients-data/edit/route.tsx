import { CreateClient, EditClient } from '@/lib/ClientController';
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
    console.log("Hit post api");

    const data = await req.json();

    console.log("API business name");
    console.log(data.business_name);

    let id = await EditClient(data.client_id, data.business_name, data.contact_name, data.contact_email, data.contact_phone, data.address);

    return NextResponse.json({client_id: id}, {status: 200,});

  }