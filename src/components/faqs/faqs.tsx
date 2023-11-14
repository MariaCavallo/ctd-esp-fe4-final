import React, { FC } from 'react'
import { FaqsType, faqsData } from '../faqs/faqsData'
import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
    data: FaqsType[]
}

const Faqs: FC<Props> = ({ data }) => {

    return (
        <div>
            {data.map((faq) => (
                <Accordion key={faq.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography>{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>{faq.answer}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    )
}

export const getStaticProps = () => {
    
    const data = faqsData;

    return {
        props: {
            data,
        },
    };
}

export default Faqs