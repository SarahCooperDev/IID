'use client'

import Head from 'next/head';
import Link from 'next/link';

import styles from '../../../styles/main.module.css';
import detailstyles from '../../../styles/details.module.css';

import useSWR from 'swr';

const fetcher = (url:string) => fetch(url).then((res) => res.json())

export default function Record({ params }: { params: {id: string}}){
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
            </div>
        </div>
    )
}