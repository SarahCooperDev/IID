'use client'

import Head from 'next/head';
import Link from 'next/link';

import styles from '../../../styles/main.module.css';
import detailstyles from '../../../styles/details.module.css';

import useSWR from 'swr';
import { ChargeVM } from '@/models/ChargeVM';

const fetcher = (url:string) => fetch(url).then((res) => res.json())

export default function ClientsIdPage({ params }: { params: {id: string}}){
    const { data, error } = useSWR(`/api/clients-data/${params.id}`, fetcher);

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
        <div className={styles.container}>
            <Head>
                <title>{data.client_id}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.content}>
                <h1 className={styles.page_title}>{data.business_name}</h1>
                <Link href="/clients" className={styles.styled_link}>Back</Link>
                <Link href={`/clients/edit/${data.client_id}`}><button className={styles.add_button}>Edit Client</button></Link>
                <Link href={`/charges/new/${data.client_id}`}><button className={styles.add_button}>New Charge</button></Link>
                <div className={detailstyles.detail_div}>
                    <div className={detailstyles.left_div}>
                        <div className={detailstyles.left_details_div}>
                            <p>Client No. {data.client_id}</p>
                            <p>Status: {data.client_status}</p>
                            <p>Address: {data.address}</p>
                            <p>Date Created: {data.date_created}</p>
                        </div>
                    </div>
                    <div className={detailstyles.right_div}>
                        <div className={detailstyles.right_details_div}>
                            <h1 className={detailstyles.section_heading}>Contact Details</h1>
                            <hr className={detailstyles.padded_line}></hr>
                            <p>Contact Name: {data.contact_name}</p>
                            <p>Email: {data.contact_email}</p>
                            <p>Phone: {data.contact_phone}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.table_div}>
                    <h1 className={detailstyles.section_heading}>Charges</h1>
                    <hr className={detailstyles.padded_line}></hr>
                    <table className={styles.record_table}>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date of Service</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Client ID</th>
                            <th>Client</th>
                            <th>Client Contact</th>
                            <th>Charge Status</th>
                            <th>Charge Remaining</th>
                            <th>Link</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.charges.map((charge:ChargeVM) => {
                            return (
                            <tr key={charge.charge_id} className={styles.record_table_row}>
                                <th><Link href={`/charges/` + charge.charge_id}>{charge.charge_id}</Link></th>
                                <th><p>{charge.date_of_service.toString()}</p></th>
                                <th>{charge.description}</th>
                                <th>{charge.category}</th>
                                <th>{charge.client_id}</th>
                                <th>{charge.client_business}</th>
                                <th>{charge.client_contact}</th>
                                <th>{charge.charge_status}</th>
                                <th>${charge.charge_remaining}</th>
                                <th><Link href={`/charges/` + charge.charge_id} className={styles.styled_link}>View</Link></th>
                            </tr>
                            )})}
                        </tbody>
                    </table>
                    </div>
            </div>
        </div>
    )
}