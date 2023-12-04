import { Box, Card, CardContent, Container, Paper, Typography } from '@mui/material'
import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { CheckoutInput } from 'src/features/checkout/checkout.types'

interface Props {
  data: CheckoutInput['order'];
}

const Index: NextPage<Props> = ({ data }) => {

  const [localData, setLocalData] = useState<CheckoutInput | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('formData');

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setLocalData(parsedData);
      }
    }
  }, [])

  return (
    <Box>
      <Box component={'section'} margin={3} width={'80vw'} sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignContent: 'center', marginLeft: '12%' }}>
        <Typography variant='h4' bgcolor={'green'} color={'white'} textAlign={'center'} fontWeight={700}>
          Enjoy your purchase!
        </Typography>
        <Box marginTop={2}>
          <Container sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
            <Paper>
              <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CardContent>
                  <Image src={localData?.order?.image || ''} alt={localData?.order?.name} width={300} height={300} />
                </CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '2%' }}>
                  <Typography variant='h4' color={"#0D47A1"} >{localData?.order?.name}</Typography>
                  <br />
                  <Typography variant='h6' color={"#1E88E5"}>${localData?.order?.price}</Typography>
                </Box>
              </Card>
            </Paper>
          </Container>
          <Container sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', alignContent: 'center', marginTop: 2 }}>
            <Paper sx={{ width: '32rem', height: '8rem' }}>
              <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', height: '8rem' }}>
                <Typography color={"#0D47A1"} fontWeight={700}>Personal information</Typography>
                <Box>
                  <Typography>{`${localData?.customer?.name}  ${localData?.customer?.lastName}`}</Typography>
                  <br />
                  <Typography>{localData?.customer?.email}</Typography>
                </Box>
              </Card>
            </Paper>
            <Paper sx={{ width: '32rem', height: '8rem' }}>
              <Card sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', height: '8rem' }}>
                <Typography color={"#0D47A1"} fontWeight={700}>Delivery address</Typography>
                <Box>
                  <Typography>{localData?.address?.address}</Typography>
                  <br />
                  <Typography>{`${localData?.address?.city}, ${localData?.address?.state} (${localData?.address?.zipCode})`}</Typography>
                </Box>
              </Card>
            </Paper>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  let queryData = null;
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem('formData');
    queryData = storedData ? JSON.parse(storedData) : null;
  }

  return {
    props: {
      data: queryData,
    }
  }
}

export default Index