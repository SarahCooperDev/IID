'use client'

import { BaseSyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Head from "next/head";

import styles from '../../../styles/main.module.css';
import inputStyles from '../../../styles/input.module.css';

export default function ClientsNewPage(){
    const router = useRouter();

    const onSubmit = async (event: BaseSyntheticEvent<Event, EventTarget & HTMLFormElement>) => {
        event.preventDefault();
        const values = Object.fromEntries(new FormData(event.target));

        const response = await fetch('/api/clients-data/new', {
            method: 'POST',
            body: JSON.stringify(values),
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
                                    <th className={inputStyles.form_cell}><input type="text" name="business_name" className={inputStyles.input_field}/></th>
                                </tr>
                                <tr className={inputStyles.form_row}>
                                    <th className={inputStyles.form_cell}>Contact Name: </th>
                                    <th className={inputStyles.form_cell}><input type="text" name="contact_name" className={inputStyles.input_field}/></th>
                                </tr>
                                <tr className={inputStyles.form_row}>
                                    <th className={inputStyles.form_cell}>Contact Email: </th>
                                    <th className={inputStyles.form_cell}><input type="text" name="contact_email" className={inputStyles.input_field}/></th>
                                </tr>
                                <tr className={inputStyles.form_row}>
                                    <th className={inputStyles.form_cell}>Contact Phone: </th>
                                    <th className={inputStyles.form_cell}><input type="text" name="contact_phone" className={inputStyles.input_field}/></th>
                                </tr>
                                <tr className={inputStyles.form_row}>
                                    <th className={inputStyles.form_cell}>Address: </th>
                                    <th className={inputStyles.form_cell}><input type="text" name="address" className={inputStyles.input_field}/></th>
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