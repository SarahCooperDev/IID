'use client'

import Page from '../page';

export default function ChargesNewIdPage({ params }: { params: {id: string}}){

    console.log("Parameter")
    console.log(params.id);

    return (
        <Page idProp={params.id}/>
    )
}