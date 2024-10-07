'use client'

import DateTimePicker from 'react-datetime-picker';
import { BaseSyntheticEvent, useState, useEffect, useRef, FormEvent } from 'react';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Head from "next/head";


import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import "react-datepicker/dist/react-datepicker.css";

import styles from '../../../../styles/main.module.css';
import inputStyles from '../../../../styles/input.module.css';
import { render } from 'react-dom';
import useSWR from 'swr';
import { ClientVM } from '@/models/ClientVM';
import { setHours } from 'react-datepicker/dist/date_utils';

const fetcher = (url:string) => fetch(url).then((res) => res.json())
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function ChargesEditIdPage({ params }: { params: {id: string}}){
    const router = useRouter();
    const [value, onChange] = useState<Value>(new Date());
    const [isServiceData, setData] = useState({ isServices: "None" });
    const [hoursInput, setHoursInput] = useState({ hours: -1});
    const [rateInput, setRateInput] = useState({rate: -1});
    const [total, setTotal] = useState({ total: -1})

    const form = useRef() as React.MutableRefObject<HTMLFormElement>;

    const { data, error } = useSWR(`/api/charges-data/edit/${params.id}`, fetcher);

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    // Handle Client selection dropdown
    const clientOptions: { value: number; label: string; }[] = [];

    data.clientData.map((client:ClientVM) => (
        clientOptions.push({ value: client.client_id, label: client.business_name})
    ))

    var client = clientOptions.find((c) => c.value == +data.chargeData.client_id);

    // Handle category selection dropdown
    const categoryOptions: { value: string; label: string; }[] = [];
    categoryOptions.push({value: "Goods", label: "Goods"});
    categoryOptions.push({value: "Services", label: "Services"});
    categoryOptions.push({value: "Other", label: "Other"});

    var category = categoryOptions.find((c) => c.value == data.chargeData.category);
    
    
    let defaultHours = +data.chargeData.service_hours;

    if(hoursInput.hours > 0){
        defaultHours = +hoursInput.hours;
    }
        
    const handleSelectChange = (e: React.FormEvent<HTMLSelectElement>) => {       
        if(e.value == "Services"){
            setData({isServices: "Services"});
        } else if(e.value == "Goods"){
            setData({isServices: "Goods"});
        } else{
            setData({isServices: "Other"});
        }
    }

    const handleTotalChange = () => {
        if(form?.current?.category.value == "Services"){
            let hourlyrate: number = +form?.current?.charge_amount.value;
            let hrs: number = +form?.current?.hours.value;
            let calc = hourlyrate * hrs;
            //setTotal({total: calc});
        }
    }

    const onSubmit = async (event: BaseSyntheticEvent<Event, EventTarget & HTMLFormElement>) => {
        event.preventDefault();

        let setCategory = isServiceData.isServices;

        if(setCategory == "None"){
            setCategory = data.chargeData.category;
        }

        let service_hours = 1;

        if(setCategory == "Services"){
            service_hours = form?.current?.hours.value;
        }

        const response = await fetch(`/api/charges-data/edit/${params.id}`, {
            method: 'POST',
            body: JSON.stringify({
                charge_id: params.id,
                description: form?.current?.description.value,
                category: setCategory,
                client_id: form?.current?.clientSelect.value,
                service_hours: service_hours,
                charge_amount: form?.current?.charge_amount.value,
                date_of_service: value?.toLocaleString()
            }),
            headers: {'Content-Type' : 'application/json'}
        });
    
        const resData = await response.json()

        router.push(`/charges/${resData.chargeId}`);
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>New Charge</title>
                <script src="https://connect.facebook.net/en_US/sdk.js" />
            </Head>
            <div className={styles.content}>
                <h1 className={styles.page_title}>Edit Charge {params.id}</h1>
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
                                    <th className={inputStyles.form_cell}>
                                        <input type="text" name="description" className={inputStyles.input_field} defaultValue={data.chargeData.description}/>
                                    </th>
                                </tr>
                                <tr className={inputStyles.form_row}>
                                    <th className={inputStyles.form_cell}>Category: </th>
                                    <th className={inputStyles.form_cell}>
                                        <Select
                                            className={inputStyles.client_select}
                                            classNamePrefix="select"
                                            defaultValue={category}
                                            isDisabled={false}
                                            isLoading={false}
                                            isClearable={true}
                                            isRtl={false}
                                            isSearchable={true}
                                            name="categorySelect"
                                            options={categoryOptions}
                                            onChange={e => handleSelectChange(e)}
                                        /></th>
                                </tr>
                                <HoursInput
                                    isServices={isServiceData.isServices}
                                    category={data.chargeData.category}
                                    handleTotalChange={handleTotalChange}
                                    service_hours={data.chargeData.service_hours}
                                    setHoursInput= {setHoursInput}
                                    defaultHours={defaultHours}/>
                                <tr className={inputStyles.form_row}>
                                    <AmountInputLabel
                                        isServices={isServiceData.isServices}
                                        category={data.chargeData.category}/>
                                    <th className={inputStyles.form_cell}>
                                        <input type="text" name="charge_amount" className={inputStyles.input_field} onChange={event => setRateInput({rate: +event.target.value})} defaultValue={data.chargeData.charge_amount}/>
                                    </th>
                                </tr>
                                <TotalDisplay
                                    isServices={isServiceData.isServices}
                                    category={data.chargeData.category}
                                    charge_amount={data.chargeData.charge_amount}
                                    service_hours={data.chargeData.service_hours}
                                    total={total.total}
                                    rate={rateInput.rate}
                                    hours={hoursInput.hours}
                                />
                                <tr className={inputStyles.form_row}>
                                    <th className={inputStyles.form_cell}>Date of Service: </th>
                                    <th className={inputStyles.form_cell}>
                                        <DateTimePicker className={inputStyles.datetimepicker} onChange={onChange} value={value}/>
                                    </th>
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

function TotalDisplay(input:any){
    if(input.isServices == "None" && input.category == "Services"){
        var totalRate = input.charge_amount;
        var totalHours = input.service_hours;

        if(input.rate !> 0){ totalRate = input.rate; }
        if(input.hours !> 0){ totalHours = input.hours;}

        return (
            <tr className={inputStyles.form_row}>
                <th className={inputStyles.form_cell}>Total: </th>
                <th className={inputStyles.form_cell}>${totalRate * totalHours}</th>
            </tr>
        )
    } else if(input.isServices == "Services"){
        var totalRate = input.charge_amount;
        var totalHours = input.service_hours;

        if(input.rate !> 0){ totalRate = input.rate; }
        if(input.hours !> 0){ totalHours = input.hours;}

        return (
            <tr className={inputStyles.form_row}>
                <th className={inputStyles.form_cell}>Total: </th>
                <th className={inputStyles.form_cell}>${totalRate * totalHours}</th>
            </tr>
        )
    }
}

function AmountInputLabel(input:any){
    if(input.isServices == "Services" || (input.isServices == "None" && input.category == "Services")){
        return <th className={inputStyles.form_cell}>Hourly Rate: </th>
    } else {
        return <th className={inputStyles.form_cell}>Charge Amount: </th>
    }
}

function HoursInput(input:any){
    if(input.isServices == "Services" || (input.isServices == "None" && input.category == "Services")){
        return (
            <tr className={inputStyles.form_row}>
                <th className={inputStyles.form_cell}>Hours: </th>
                <th className={inputStyles.form_cell}>
                    <input type="text" name="hours" className={inputStyles.input_field} onChange={event => input.setHoursInput({ hours: +event.target.value})} defaultValue={input.defaultHours}></input>
                </th>
            </tr>
        )
    }
}