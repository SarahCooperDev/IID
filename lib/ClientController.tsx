import moment from 'moment';

import { ClientVM } from "@/models/ClientVM";
import { InsertClient, SelectAllClients, SelectClientWithID } from "./DBManager";
import { IClient } from "./DBManager";

function ProcessClient(client:IClient){
    var date = moment(client.date_created.toString()).format("DD-MM-YYYY");
    var processedClient = new ClientVM(client.client_id, client.contact_name, client.email, client.phone, client.business_name, client.address, date, client.status);
    return processedClient;
        
}

export async function GetAllClients(){
    try{
        const clients = await SelectAllClients();
        var  data:ClientVM[] = [];

        for(const client of clients){
            let processedClient = await ProcessClient(client);
            data.push(processedClient);
        }

        return data;

    } catch (err){
        console.log(`Error retrieving all clients: ${err}`);
    
        return null;
    }
}

export async function GetClientWithID(id:string){
    try{
        const client = await SelectClientWithID(id);
        const processedclient = ProcessClient(client);

        return processedclient;
    } catch (err){
        console.log(`Error getting client of id ${id}: ${err}`);
        return null;
    }
}

export async function CreateClient(business_name:string, contact_name:string, contact_email:string, contact_phone:string, address:string){
    try{
        const client = await InsertClient(business_name, contact_name, contact_email, contact_phone, address);

        return client;
    } catch (err){
        console.log(`Error creating client: ${err}`);
        return null;
    }
}