'use client'

import { BaseSyntheticEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Head from "next/head";

import useSWR from 'swr';

import styles from '../../../../styles/main.module.css';
import inputStyles from '../../../../styles/input.module.css';

const fetcher = (url:string) => fetch(url).then((res) => res.json())

export default function ClientsEditIdPage({ params }: { params: {id: string}}){
    const router = useRouter();

    const { data, error } = useSWR(`/api/clients-data/${params.id}`, fetcher);

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    const form = useRef() as React.MutableRefObject<HTMLFormElement>;

    const onSubmit = async (event: BaseSyntheticEvent<Event, EventTarget & HTMLFormElement>) => {
        event.preventDefault();

        const response = await fetch('/api/clients-data/edit', {
            method: 'POST',
            body: JSON.stringify({
                client_id: params.id,
                business_name: event.target.business_name.value,
                contact_name: event.target.contact_name.value,
                contact_email: event.target.contact_email.value,
                contact_phone: event.target.contact_phone.value,
                address: event.target.address.value
            }),
            headers: {'Content-Type' : 'application/json'}
        });
 
        const data = await response.json()

        router.push(`/clients/${data.client_id}`);
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Clients</title>
                <script src="https://connect.facebook.net/en_US/sdk.js" />
            </Head>
            <div className={styles.content}>
                <h1 className={styles.page_title}>Add New Client</h1>
                <Link href="/clients" className={styles.styled_link}>Back</Link>
                <div className={inputStyles.form_div}>
                    <form onSubmit={onSubmit}>
                        <table>
                            <tbody>
                                <tr className={inputStyles.form_row}>
                                    <th className={inputStyles.form_cell}>Business Name: </th>
                                    <th className={inputStyles.form_cell}>
                                        <input type="text" name="business_name" className={inputStyles.input_field} defaultValue={data.business_name}/>
                                    </th>
                                </tr>
                                <tr className={inputStyles.form_row}>
                                    <th className={inputStyles.form_cell}>Contact Name: </th>
                                    <th className={inputStyles.form_cell}>
                                        <input type="text" name="contact_name" className={inputStyles.input_field} defaultValue={data.contact_name}/>
                                    </th>
                                </tr>
                                <tr className={inputStyles.form_row}>
                                    <th className={inputStyles.form_cell}>Contact Email: </th>
                                    <th className={inputStyles.form_cell}>
                                        <input type="text" name="contact_email" className={inputStyles.input_field} defaultValue={data.contact_email}/>
                                    </th>
                                </tr>
                                <tr className={inputStyles.form_row}>
                                    <th className={inputStyles.form_cell}>Contact Phone: </th>
                                    <th className={inputStyles.form_cell}>
                                        <input type="text" name="contact_phone" className={inputStyles.input_field} defaultValue={data.contact_phone}/>
                                    </th>
                                </tr>
                                <tr className={inputStyles.form_row}>
                                    <th className={inputStyles.form_cell}>Address: </th>
                                    <th className={inputStyles.form_cell}>
                                        <input type="text" name="address" className={inputStyles.input_field} defaultValue={data.address}/>
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