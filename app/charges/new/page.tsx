'use client'

import DateTimePicker from 'react-datetime-picker';
import { BaseSyntheticEvent, useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Head from "next/head";


import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import "react-datepicker/dist/react-datepicker.css";
import styles from '../../../styles/main.module.css';
import inputStyles from '../../../styles/input.module.css';
import { render } from 'react-dom';
import useSWR from 'swr';
import { ClientVM } from '@/models/ClientVM';

const fetcher = (url:string) => fetch(url).then((res) => res.json())
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function ChargesNewPage(props: any){
    const router = useRouter();
    const [value, onChange] = useState<Value>(new Date());
    const [isServiceData, setData] = useState({ isServices: false });
    const [total, setTotal] = useState({ total: 0})

    const form = useRef() as React.MutableRefObject<HTMLFormElement>;
    const { data, error } = useSWR('/api/clients-data', fetcher);

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    const clientOptions: { value: number; label: string; }[] = [];

    data.map((client:ClientVM) => (
        clientOptions.push({ value: client.client_id, label: client.business_name})
    ))

    console.log("Prop data");
    console.log(props.idProp);

    var client = clientOptions.find((c) => c.value == +"1");

    if(props.idProp){
        client = clientOptions.find((c) => c.value == +props.idProp);
    }
    
    const handleSelectChange = () => {
        if(isServiceData.isServices == false){
            setData({isServices: true});
        } else {
            setData({isServices: false});
        }
    }

    const handleTotalChange = () => {
        if(form?.current?.category.value == "Services"){
            let hourlyrate: number = +form?.current?.charge_amount.value;
            let hrs: number = +form?.current?.hours.value;
            let calc = hourlyrate * hrs;
            setTotal({total: calc});
        }
    }

    const onSubmit = async (event: BaseSyntheticEvent<Event, EventTarget & HTMLFormElement>) => {
        event.preventDefault();

        let service_hours = 1;

        if(form?.current?.category.value == "Services"){
            service_hours = form?.current?.hours.value;
        }

        console.log("Client id");
        console.log(form?.current?.clientSelect.value);

        const response = await fetch('/api/charges-data/new', {
            method: 'POST',
            body: JSON.stringify({
                description: form?.current?.description.value,
                category: form?.current?.category.value,
                client_id: form?.current?.clientSelect.value,
                service_hours: service_hours,
                charge_amount: form?.current?.charge_amount.value,
                date_of_service: value?.toLocaleString()
            }),
            headers: {'Content-Type' : 'application/json'}
        });
    
        const data = await response.json()

        router.push(`/charges/${data.chargeId}`);
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>New Charge</title>
                <script src="https://connect.facebook.net/en_US/sdk.js" />
            </Head>
            <div className={styles.content}>
                <h1 className={styles.page_title}>Add New Charge</h1>
                <Link href="/charges" className={styles.styled_link}>Back</Link>
                <div className={inputStyles.form_div}>
                    <form onSubmit={onSubmit} ref={form}>
                        <table>
                            <tbody>
                                <tr className={inputStyles.form_row}>
                                    <th className={inputStyles.form_cell}>Client ID: </th>
                                    <th className={inputStyles.form_cell}><Select
                                        className={inputStyles.client_select}
                                        classNamePrefix="select"
                                        defaultValue={client}
                                        isDisabled={false}
                                        isLoading={false}
                                        isClearable={true}
                                        isRtl={false}
                                        isSearchable={true}
                                        name="clientSelect"
                                        options={clientOptions}
                                    /> </th>
                                </tr>
                                <tr className={inputStyles.form_row}>
                                    <th className={inputStyles.form_cell}>Description: </th>
                                    <th className={inputStyles.form_cell}><input type="text" name="description" className={inputStyles.input_field}/></th>
                                </tr>
                                <tr className={inputStyles.form_row}>
                                    <th className={inputStyles.form_cell}>Category: </th>
                                    <th className={inputStyles.form_cell}>
                                        <select id="category" name="category" className={inputStyles.input_field} onChange={handleSelectChange}>
                                            <option value="Goods">Goods</option>
                                            <option value="Services">Services</option>
                                            <option value="Other">Other</option>    
                                    </select></th>
                                </tr>
                                {isServiceData.isServices == true &&
                                    <tr className={inputStyles.form_row}>
                                        <th className={inputStyles.form_cell}>Hours: </th>
                                        <th className={inputStyles.form_cell}><input type="text" name="hours" className={inputStyles.input_field} onChange={handleTotalChange}></input></th>
                                    </tr>
                                }
                                <tr className={inputStyles.form_row}>
                                    {isServiceData.isServices
                                        ? <th className={inputStyles.form_cell}>Hourly Rate: </th>
                                        : <th className={inputStyles.form_cell}>Charge Amount: </th>
                                    }
                                    <th className={inputStyles.form_cell}><input type="text" name="charge_amount" className={inputStyles.input_field} onChange={handleTotalChange}/></th>
                                </tr>
                                {isServiceData.isServices == true &&
                                    <tr className={inputStyles.form_row}>
                                        <th className={inputStyles.form_cell}>Total: </th>
                                        <th className={inputStyles.form_cell}>${total.total}</th>
                                    </tr>
                                }
                                <tr className={inputStyles.form_row}>
                                    <th className={inputStyles.form_cell}>Date of Service: </th>
                                    <th className={inputStyles.form_cell}><DateTimePicker className={inputStyles.datetimepicker} onChange={onChange} value={value}/></th>
                                </tr>
                            </tbody>
                        </table>
                        <button type="submit" className={inputStyles.submit_button}>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    )
}