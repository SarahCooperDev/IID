import mysql, { ConnectionOptions, RowDataPacket } from 'mysql2';
import moment from 'moment';

const CHARGES_TB = 'charges_tb';
const CLIENTS_TB = 'clients_tb';

export interface ICharge extends RowDataPacket {
    charge_id:number;
    date_of_service:Date;
    description:string;
    category:string;
    client_id:number;
    charge_amount:number;
    service_hours:number;
    charge_status:string;
    charge_remaining:number;
}

export interface IClient extends RowDataPacket {
    client_id:number;
    contact_name:string;
    contact_email:string;
    contact_phone:string;
    business_name:string;
    address:string;
    date_created:Date;
    client_status:string;
}

const access: ConnectionOptions = {
    host: 'localhost',
    user: 'root',
    password: 'sqlroot13!',
    database: 'itisdonedb',
    //debug: true
};

const db = mysql.createConnection(access);

/*
*
* Startup Functions
*
*/

export function CreateTables(){
    return new Promise((resolve, reject) => {
        let db = mysql.createConnection(access);

        db.query('DROP TABLE IF EXISTS CHARGES_TB, CLIENTS_TB', (err) => {
            if(err) {
                console.log(`Failed to drop tables: ${err}`);
                db.destroy();
                reject(err);
            } else {
                db.destroy();

                db = mysql.createConnection(access);

                var chargeQuery = `CREATE TABLE ${CHARGES_TB} (charge_id int NOT NULL AUTO_INCREMENT PRIMARY KEY, date_of_service datetime, description varchar(255), category varchar(255), client_id int, charge_amount DECIMAL(13, 2), service_hours DECIMAL(13, 2), charge_status varchar(255), charge_remaining DECIMAL(13, 2))`;

                db.query(chargeQuery, (err, result) => {
                    if(err) {
                        console.log(`Create charge table not successful: ${err}`);
                        db.destroy();
                        reject(err);
                    } else {
                        db.destroy();
                        resolve(result);
                    }
                });

                var clientQuery = `CREATE TABLE ${CLIENTS_TB} (client_id int NOT NULL AUTO_INCREMENT PRIMARY KEY, contact_name varchar(255), business_name varchar(255), email varchar(255), phone varchar(255), address varchar(255), date_created datetime, status varchar(255))`;
                db.query(clientQuery, (err, result) => {
                    if(err) {
                        console.log(`Create client table not successful: ${err}`);
                        db.destroy();
                        reject(err);
                    } else {
                        db.destroy();
                        resolve(result);
                    }
                });
            }
        });
    })
}

export async function InsertDummyData(){
    return new Promise((resolve, reject) => {
        var chargeData = [
            {'date_of_service': '2024-09-20 10:00:00', 'description': '1 hr of IT support', 'category': 'service', 'client_id': 1, 'client': "Robyn Thomas", 'charge': 100, 'charge_status': 'Paid', 'charge_remaining': 0}, 
            {'date_of_service': '2024-09-22 11:00:00', 'description': 'website', 'category': 'good', 'client_id': 0, 'client': "Robyn Thomas", 'charge': 3000, 'charge_status': 'Paid', 'charge_remaining': 0},
            {'date_of_service': '2024-09-25 12:00:00', 'description': '1.5 hr of IT support', 'category': 'service', 'client_id': 1, 'client': "Robyn Thomas", 'charge': 150, 'charge_status': 'In Progress', 'charge_remaining': 100},
            {'date_of_service': '2024-09-29 13:00:00', 'description': 'hosting', 'category': 'good', 'client_id': 0, 'client': "Robyn Thomas", 'charge': 25, 'charge_status': 'Unpaid', 'charge_remaining': 25}
        ];

        var clientData = [
            {'contact_name': 'Robyn Thomas', 'business_name': 'Mindscience Therapy', 'email': 'robyn@mindscience.com', 'phone': '0934432432', 'address': '22 example address suburbia', 'status': 'Developing'},
            {'contact_name': 'Some Client', 'business_name': 'Some business', 'email': 'some@some.com', 'phone': '8932893283', 'address': '10 some rd suburbia', 'status': 'Lead'}
        ]
    
        chargeData.forEach((record) => {
            const db = mysql.createConnection(access);
    
            var query = `INSERT INTO ${CHARGES_TB}(date_of_service, description, category, client_id, charge_amount, charge_status, charge_remaining) VALUES (`;
            query += '"' + record.date_of_service + '"' + ', ' + '"' +record.description+'"' + ', ' + '"' +record.category+'"' + ', ' + record.client_id + ', ' + record.charge + ', ' + '"' +record.charge_status+'"' + ', ' + record.charge_remaining + ')';
    
            db.query(query, (err, result) => {
                if(err){
                    console.log(`Insert charge dummy data failed: ${err}`);
                    db.destroy();
                    reject(err);
                } else {
                    db.destroy();
                    resolve(result);
                }
            })
        });

        clientData.forEach((record) => {
            const db = mysql.createConnection(access);

            var query = `INSERT INTO ${CLIENTS_TB}(contact_name, business_name, email, phone, address, date_created, status) VALUES(`;
            query += `"${record.contact_name}", "${record.business_name}", "${record.email}", "${record.phone}", "${record.address}", NOW(), "${record.status}")`;

            db.query(query, (err, result) => {
                if(err){
                    console.log(`Insert client dummy data failed: ${err}`);
                    db.destroy();
                    reject(err);
                } else {
                    db.destroy();
                    resolve(result);
                }
            })
        });

        console.log(`Insert dummy data succeeded`);
    });   
}

/*
*
* Charge Functions
*
*/

export function GetAllCharges(): Promise<ICharge[]> {
    const db = mysql.createConnection(access);
    return new Promise((resolve, reject) => {

        var q = `SELECT * FROM ${CHARGES_TB};`;
        db.query<ICharge[]>(q, (err, result) => {
            if(err){
                console.log(`Select failed: ${err}`);
                db.destroy();
                reject(err);
            } else {
                db.destroy();
                resolve(result);
            }       
        })
    })
}

export async function GetAllChargeIDs(): Promise<ICharge[]>{
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection(access);

        var q = `SELECT * FROM ${CHARGES_TB}`;
        db.query<ICharge[]>(q, (err, result) => {
            if(err){
                console.log(`Select failed: ${err}`);
                db.destroy();
                reject(err);
            } else {
                db.destroy();
                resolve(result);
            }
        })
    });
}

export async function SelectChargeWithID(id:string): Promise<ICharge>{
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection(access);
        
        var q = `SELECT * FROM ${CHARGES_TB} WHERE charge_id=${id}`;
        db.query<ICharge[]>(q, (err, result) => {
            if(err){
                console.log(`Select with ID failed: ${err}`);
                db.destroy();
                reject(err);
            } else {
                db.destroy();
                resolve(result[0]);
            }
        })
    });
}

export async function SelectClientCharges(id:string): Promise<ICharge[]>{
    return new Promise((resolve, reject) => {
        console.log("Selecting charges for client");
        console.log(id);
        
        const db = mysql.createConnection(access);

        var q = `SELECT * FROM ${CHARGES_TB} WHERE client_id=${id}`;
        db.query<ICharge[]>(q, (err, result) => {
            if(err){
                console.log(`Select client charges failed: ${err}`);
                console.log(q);
                db.destroy();
                reject(err);
            } else {
                db.destroy();
                resolve(result);
            }       
        })
    })
}

export async function InsertCharge(description:string, category:string, client_id:string, charge_amount:string, service_hours:string, date_of_service:string){
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection(access);

        var clientId: number = +client_id;
        var chargeAmount: number = +charge_amount;
        var serviceHours: number = +service_hours;
        var dateString = moment(date_of_service).format("YYYY-MM-DD HH:mm:ss");

        var query = `INSERT INTO ${CHARGES_TB}(date_of_service, description, category, client_id, charge_amount, service_hours, charge_status, charge_remaining) VALUES(`;
        query += `'${dateString}', "${description}", "${category}", "${clientId}", "${chargeAmount}", "${serviceHours}", "Unpaid", "${chargeAmount * serviceHours}")`;

        db.query(query, (err, result) => {
            if(err){
                console.log(`Insert charge failed: ${err}`);
                db.destroy();
                reject(err);
            } else {
                db.destroy();
                const chargeId:number = result.insertId;
                resolve(chargeId);
            }
        })
    });
}

export async function UpdateCharge(charge_id:string, description:string, category:string, client_id:string, charge_amount:string, service_hours:string, date_of_service:string){
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection(access);

        var chargeId: number = +charge_id;
        var clientId: number = +client_id;
        var chargeAmount: number = +charge_amount;
        var serviceHours: number = +service_hours;
        var dateString = moment(date_of_service).format("YYYY-MM-DD HH:mm:ss");

        console.log(`Charge ID: ${chargeId}`);

        var query = `UPDATE ${CHARGES_TB} SET `
        query += `date_of_service="${dateString}", description="${description}", category="${category}", client_id="${clientId}", charge_amount="${chargeAmount}", `;
        query += `service_hours="${serviceHours}" `
        query += `WHERE charge_id=${charge_id}`;

        console.log(query);
          
        db.query(query, (err, result) => {
            if(err){
                console.log(`Insert charge failed: ${err}`);
                db.destroy();
                reject(err);
            } else {
                db.destroy();
                resolve(chargeId);
            }
        })
    });
}

/*
*
* Client Functions
*
*/

export async function SelectAllClients(): Promise<IClient[]>{
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection(access);

        var q = `SELECT * FROM ${CLIENTS_TB}`;
        db.query<IClient[]>(q, function (err, result) {
            if(err){
                console.log(`Select failed: ${err}`);
                db.destroy();
                reject(err);
            } else {
                db.destroy();
                resolve(result);
            }
        })
    });
}

export async function SelectClientWithID(id:string): Promise<IClient>{
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection(access);

        var q = `SELECT * FROM ${CLIENTS_TB} WHERE client_id=${id}`;
        db.query<IClient[]>(q, function (err, result) {
            if(err){
                console.log(`Select failed: ${err}`);
                db.destroy();
                reject(err);
            } else {
                db.destroy();
                resolve(result[0]);
            }
        })
    });
}

export async function InsertClient(business_name:string, contact_name:string, contact_email:string, contact_phone:string, address:string){
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection(access);

        var query = `INSERT INTO ${CLIENTS_TB}(contact_name, business_name, email, phone, address, date_created, status) VALUES(`;
        query += `"${contact_name}", "${business_name}", "${contact_email}", "${contact_phone}", "${address}", NOW(), "Lead")`;

        db.query(query, (err, result) => {
            if(err){
                console.log(`Insert client dummy data failed: ${err}`);
                db.destroy();
                reject(err);
            } else {
                db.destroy();
                const clientId:number = result.insertId;
                resolve(clientId);
            }
        })
    });
}

export async function UpdateClient(client_id:string, business_name:string, contact_name:string, contact_email:string, contact_phone:string, address:string){
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection(access);

        var query = `UPDATE ${CLIENTS_TB} SET `
        query += `contact_name="${contact_name}", business_name="${business_name}", email="${contact_email}", phone="${contact_phone}", address="${address}" `;
        query += `WHERE client_id=${client_id}`;

        db.query(query, (err, result) => {
            if(err){
                console.log(`Update client data failed: ${err}`);
                db.destroy();
                reject(err);
            } else {
                db.destroy();
                resolve(client_id);
            }
        })
    });
}
