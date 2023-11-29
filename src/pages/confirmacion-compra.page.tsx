import { Box, Card, CardContent, Container, Paper, Typography } from '@mui/material'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { CheckoutInput } from 'src/features/checkout/checkout.types'

interface DataProps {
  dataCustomer: CheckoutInput['customer'],
  dataAddress: CheckoutInput['address'],
  dataOrder: CheckoutInput['order'],
}

interface Props {
  data: DataProps;
}

const ConfirmationPage: NextPage<Props> = ({ data }) => {

  const [localData, setLocalData] = useState<DataProps | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('formData');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setLocalData(parsedData);
      }
    }
  }, [])

  const displayData = localStorage || data;

  return (
    <Box>
      <Box component={'section'} margin={3} width={'80vw'} sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignContent: 'center', marginLeft: '12%' }}>
        <Typography variant='h4' bgcolor={'green'} color={'white'} textAlign={'center'} fontWeight={700}>
          Enjoy your purchase!
        </Typography>
        <Box marginTop={2}>
          <Container sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
            <Paper>
              <Card>
                <CardContent>
                  <Image src={displayData?.dataOrder?.image} alt={displayData?.dataOrder?.name} width={300} height={300} />
                </CardContent>
              </Card>
              <Box>
                <Typography>{displayData?.dataOrder?.name}</Typography>
                <Typography>{displayData?.dataOrder?.price}</Typography>
              </Box>
            </Paper>
          </Container>
          <Container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', marginTop: 2 }}>
            <Paper sx={{ width: '32rem', height: '8rem' }}>
              <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around',  height: '8rem' }}>
                <Typography fontWeight={700}>Datos Personales</Typography>
                <Box>
                  <Typography>{`${displayData?.dataCustomer?.name}  ${displayData?.dataCustomer?.lastName}`}</Typography>
                  <br />
                  <Typography>{displayData?.dataCustomer?.email}</Typography>
                </Box>
              </Card>
            </Paper>
            <Paper sx={{ width: '32rem', height: '8rem' }}>
              <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', height: '8rem' }}>
                <Typography fontWeight={700}>Direccion de entrega</Typography>
                <Box>
                  <Typography>{displayData?.dataAddress?.address}</Typography>
                  <br />
                  <Typography>{`${displayData?.dataAddress?.city}, ${displayData?.dataAddress?.state} (${displayData?.dataAddress?.zipCode})`}</Typography>
                </Box>
              </Card>
            </Paper>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const queryData = params?.data ? JSON.parse(params?.data as string) : null;
  
    return {
      props: {
        data: queryData,
      }
    }
}

export default ConfirmationPage