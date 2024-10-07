
import moment from 'moment';

import { CreateTables, GetAllCharges, SelectChargeWithID, InsertDummyData, GetAllChargeIDs, InsertCharge, SelectClientCharges, UpdateCharge} from './DBManager';
import { GetClientWithID } from './ClientController';
import { ChargeVM } from '../models/ChargeVM';
import { ICharge } from './DBManager';

export async function LoadDatabase(){
    const result = await CreateTables();
    const dummy = await InsertDummyData();
}

export async function GetChargesForClient(id: string){
    try{
        const charges = await SelectClientCharges(id);
        const data:ChargeVM[] = [];

        for(const charge of charges){
            let processedCharge = await ProcessCharge(charge);
            data.push(processedCharge);
        }

        return data;

    } catch (err){
        console.log(`Error selecting charges for client: ${err}`);
        return null;
    }
}

export async function GetAllRecordIDs(){
    try{
        const charges = await GetAllChargeIDs();
        var  data:ChargeVM[] = [];

        for(const charge of charges){
            let processedCharge = await ProcessCharge(charge);
            data.push(processedCharge);
        }

        return data;
    } catch (err){
        console.log(`Error retrieving charge IDs: ${err}`);
        return null;
    }
}

async function ProcessDetailCharge(charge:ICharge){
    var date = moment(charge.date_of_service.toString()).format("DD-MM-YYYY hh:mm:ss A");
    const client = await GetClientWithID(charge.client_id.toString());
    if(client != null){
        console.log("Client exists 1");
        var processedCharge = new ChargeVM(charge.charge_id, date, charge.description, charge.category, charge.client_id, charge.charge_amount, charge.service_hours, charge.charge_status, charge.charge_remaining);
        processedCharge.SetClientObject(client);
        return processedCharge;
    } else {
        console.log("Client null");
        var processedCharge = new ChargeVM(charge.charge_id, date, charge.description, charge.category, charge.client_id, charge.charge_amount, charge.service_hours, charge.charge_status, charge.charge_remaining);
        return processedCharge;
    }
}

export async function GetChargeWithID(id:string){
    try{
        const charge = await SelectChargeWithID(id);
        const processedCharge = await ProcessDetailCharge(charge);

        return processedCharge;
    } catch (err){
        console.log(`Error getting charge of id ${id}: ${err}`);
        return null;
    }
}


async function ProcessCharge(charge:ICharge){
    var date = "date";
    const client = await GetClientWithID(charge.client_id.toString());
    if(client != null){
        var date = moment(charge.date_of_service.toString()).format("DD-MM-YYYY HH:mm:ss");
        var processedCharge = new ChargeVM(charge.charge_id, date, charge.description, charge.category, charge.client_id, charge.charge_amount, charge.service_hours, charge.charge_status, charge.charge_remaining);
        processedCharge.SetClientContact(client.contact_name);
        processedCharge.SetClientBusiness(client.business_name);
        return processedCharge;
    } else {
        console.log(`Contact ${charge.client_id} is null`);
        var processedCharge = new ChargeVM(charge.charge_id, date, charge.description, charge.category, charge.client_id, charge.charge_amount, charge.service_hours, charge.charge_status, charge.charge_remaining);
        return processedCharge;
    }
}

export async function GetAllRecords(){
    try{
        const charges = await GetAllCharges();
        const data:ChargeVM[] = [];

        for(const charge of charges){
            let processedCharge = await ProcessCharge(charge);
            data.push(processedCharge);
        }

        return data;

    } catch (err){
        console.log(`Error getting database setup ${err}`);

        var data = [
            {'id': 0, 'date_of_service': '2024-09-20', 'description': '1 hr of IT support', 'category': 'service', 'client_id': 1, 'client_contact': "Robyn Thomas", 'charge': 100, 'charge_status': 'Paid', 'charge_remaining': 0}, 
            {'id': 10, 'date_of_service': '2024-09-22', 'description': 'website', 'category': 'good', 'client_id': 1, 'client_contact': "Robyn Thomas", 'charge': 3000, 'charge_status': 'Paid', 'charge_remaining': 0}
        ];
    
        return data;
    }
}

export async function CreateCharge(description:string, category:string, client_id:string, charge_amount:string, service_hours: string, date_of_service:string){
    try{
        const charge = await InsertCharge(description, category, client_id, charge_amount, service_hours, date_of_service);

        return charge;
    } catch (err){
        console.log(`Error creating charge: ${err}`);
        return null;
    }
}

export async function EditCharge(charge_id:string, description:string, category:string, client_id:string, charge_amount:string, service_hours: string, date_of_service:string){
    try{
        const charge = await UpdateCharge(charge_id, description, category, client_id, charge_amount, service_hours, date_of_service);

        return charge;
    } catch (err){
        console.log(`Error creating charge: ${err}`);
        return null;
    }
}