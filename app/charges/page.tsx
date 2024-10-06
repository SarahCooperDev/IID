'use client'

import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';

import styles from '../../styles/main.module.css';
 
import useSWR from 'swr';
import { ChargeVM } from '@/models/ChargeVM';

const fetcher = (url:string) => fetch(url).then((res) => res.json())

export default function Page() {   
    const { data, error } = useSWR('/api/charges-data', fetcher);

    if (error) return <div>Failed to load</div>
    if (!data) return <div>Loading...</div>

    return (
        <div className={styles.container}>
          <Head>
            <title>Charges</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
    
          <div className={styles.content}>
            <div className={styles.intro_div}>
              <h2 className={styles.page_title}>Charges</h2>
              <Link href='/charges/new'><button className={styles.add_button}>New Charge</button></Link>
            </div>
            <div className={styles.table_div}>
              <table className={styles.record_table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date of Service</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Client ID</th>
                    <th>Client</th>
                    <th>Charge Status</th>
                    <th>Charge Remaining</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((charge:ChargeVM) => {
                    return (
                    <tr key={charge.charge_id} className={styles.record_table_row}>
                      <th><Link href={`/charges/` + charge.charge_id}>{charge.charge_id}</Link></th>
                      <th><p>{charge.date_of_service.toString()}</p></th>
                      <th>{charge.description}</th>
                      <th>{charge.category}</th>
                      <th>{charge.client_id}</th>
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
      );
}