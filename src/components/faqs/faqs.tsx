import React, { FC } from 'react'
import { FaqsType, faqsData } from '../faqs/faqsData'
import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
    data: FaqsType[]
}

const Faqs: FC<Props> = ({ data }) => {

    return (
        <div style={{ display: 'flex', flexDirection: 'column', margin: "1rem" }}>
            <Typography variant={"h2"} my={2} textAlign={'center'} fontSize={28} fontWeight={600}>
                Frequently Asked Questions
            </Typography>
            {data.map((faq) => (
                <Accordion key={faq.id} sx={{ width: "80rem", margin: '2px' }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography fontWeight={600}>{faq.question}</Typography>
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