import { ChargeVM } from "./ChargeVM";

export class ClientVM{
    client_id:number;
    contact_name:string;
    contact_email:string;
    contact_phone:string;
    business_name:string;
    address:string;
    date_created:string;
    client_status:string;
    charges: ChargeVM[] = [];

    constructor(client_id:number, contact_name:string, contact_email:string, contact_phone:string, business_name:string, address:string, date_created:string, client_status:string){
        this.client_id = client_id;
        this.contact_name = contact_name;
        this.contact_email = contact_email;
        this.contact_phone = contact_phone;
        this.business_name = business_name;
        this.address = address;
        this.date_created = date_created;
        this.client_status = client_status;
    }

    SetCharges(charges: ChargeVM[]){
        this.charges = charges;
    }

}