import { ClientVM } from './ClientVM';

export class ChargeVM{
    //field
    charge_id:number;
    date_of_service:string;
    description:string;
    category:string;
    client!: ClientVM;
    client_id:number;
    client_contact!:string;
    client_business!:string;
    charge_amount:number;
    service_hours!:number;
    charge_status:string;
    charge_remaining:number;

    constructor(charge_id:number, date_of_service:string, description:string, category:string, client_id: number, charge_amount:number, service_hours:number, charge_status:string, charge_remaining:number){
        this.charge_id = charge_id;
        this.date_of_service = date_of_service;
        this.description = description;
        this.category = category;
        this.client_id = client_id;
        this.charge_amount = charge_amount;
        this.service_hours = service_hours;
        this.charge_status = charge_status;
        this.charge_remaining = charge_remaining;
    }

    SetClientContact(client_contact: string){
        this.client_contact = client_contact;
    }

    SetClientBusiness(client_business: string){
        this.client_business = client_business;
    }

    SetClientObject(client: ClientVM){
        this.client = client;
    }

    SetServiceHours(service_hours:number){
        this.service_hours = service_hours;
    }

}