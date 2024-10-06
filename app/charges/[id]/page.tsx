'use client'

import Head from 'next/head';
import Link from 'next/link';

import styles from '../../../styles/main.module.css';
import detailstyles from '../../../styles/details.module.css';

import useSWR from 'swr';

const fetcher = (url:string) => fetch(url).then((res) => res.json())

export default function Record({ params }: { params: {id: string}}){
    const { data, error } = useSWR(`/api/charges-data/${params.id}`, fetcher);

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
        <div className={styles.container}>
            <Head>
                <title>{data.charge_id}</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.content}>
                <div className={detailstyles.content}>
                    <h1 className={styles.page_title}>Charge No. {params.id}</h1>
                    <Link href="/charges" className={styles.styled_link}>Back</Link>

                    <div className={detailstyles.detail_div}>
                        <div className={detailstyles.left_div}>
                            <div className={detailstyles.left_details_div}>
                                <p>Date of Service: {data.date_of_service}</p>
                                <p>Description: {data.description}</p>
                                <p>Category: {data.category}</p>
                                {data.category == "Services" &&
                                    <div>
                                        <p>Charge Amount: ${data.charge_amount} per hour</p>
                                        <p>Hours: {data.service_hours} hrs</p>
                                        <p>Total: ${data.charge_amount * data.service_hours}</p>
                                    </div>
                                } {data.category != "Services" &&
                                    <p>Charge Amount: ${data.charge_amount}</p>
                                }
                                <p>Charge Status: {data.charge_status}</p>
                                <p>Charge Remaining: ${data.charge_remaining}</p>
                            </div>
                        </div>
                        <div className={detailstyles.right_div}>
                            <div className={detailstyles.right_details_div}>
                                <p>{data.client.business_name} - {data.client_id}</p>
                                <p>Contact: {data.client.contact_name}</p>
                                <p>Contact Email: {data.client.contact_email}</p>
                                <p>Contact Phone: {data.client.contact_phone}</p>
                                <p>Address: {data.client.address}</p>
                                <p>Client Status: {data.client.client_status}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}