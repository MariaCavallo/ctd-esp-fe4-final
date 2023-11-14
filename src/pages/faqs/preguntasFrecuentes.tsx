import Faqs from '../../components/faqs/faqs'
import { faqsData } from '../../components/faqs/faqsData'
import { NextPage } from 'next';
import React from 'react'

const PreguntasFrecuentes: NextPage = () => {
    return (
        <div>   
            <Faqs data={faqsData}/>
        </div>
    )
}

export default PreguntasFrecuentes