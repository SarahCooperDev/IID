'use client'

import Link from "next/link";
import Head from "next/head";
import Script from "next/script";
import useSWR from 'swr';

import styles from '../../styles/main.module.css';
import { ClientVM } from "@/models/ClientVM";

const fetcher = (url:string) => fetch(url).then((res) => res.json())

export default function ClientsPage(){

    const { data, error } = useSWR('/api/clients-data', fetcher);

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
        <div className={styles.container}>
            <Head>
                <title>Clients</title>
                <script src="https://connect.facebook.net/en_US/sdk.js" />
            </Head>
            <Script
                src="https://connect.facebook.net/en_US/sdk.js"
                strategy="lazyOnload"
                onLoad={() =>
                console.log(`script loaded correctly, window.FB has been populated`)
                }
            />
            <div className={styles.content}>
                <h1 className={styles.page_title}>Clients</h1>
                <Link href='/clients/new'><button className={styles.add_button}>New Client</button></Link>
                <div className={styles.table_div}>
                    <table className={styles.record_table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Contact Name</th>
                                <th>Business Name</th>
                                <th>Email</th>
                                <th>Phone ID</th>
                                <th>Address</th>
                                <th>Date Created</th>
                                <th>Status</th>
                                <th>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                        {data.map((client:ClientVM) => (
                            <tr key={client.client_id} className={styles.record_table_row}>
                                <th><Link href={`/clients/` + client.client_id}>{client.client_id}</Link></th>
                                <th>{client.contact_name}</th>
                                <th>{client.business_name}</th>
                                <th>{client.contact_email}</th>
                                <th>{client.contact_phone}</th>
                                <th>{client.address}</th>
                                <th>{client.date_created}</th>
                                <th>{client.client_status}</th>
                                <th><Link href={`/clients/` + client.client_id} className={styles.styled_link}>View</Link></th>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}