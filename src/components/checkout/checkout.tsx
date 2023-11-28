import React, { FC, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material'
import Image from 'next/image';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckoutInput } from 'src/features/checkout/checkout.types';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Props {
    data : CheckoutInput['order'];
}

const steps = ['Datos Personales', 'Dirección de entrega', 'Datos del Pago'];

const personalDataSchema = yup.object().shape({
    name: yup.string().required('Name is required').max(20, 'Too long').min(3, 'Too short'),
    lastName: yup.string().required('LastName is required').max(20, 'Too long').min(3, 'Too short'),
    email: yup.string().email('Invalid email format').required('Email is required'),
})

const deliveryDataSchema = yup.object().shape({
    address: yup.string().required('Address is required').max(20, 'Too long').min(3, 'Too short'),
    apartament: yup.string().nullable(),
    city: yup.string().required('City is required').max(40, 'Too long').min(3, 'Too short'),
    state: yup.string().required('State is required').max(40, 'Too long').min(3, 'Too short'),
    zipCode: yup.number().required('ZipCode is required').max(10, 'Too long').min(5, 'Too short'),
})

const paymentDataSchema = yup.object().shape({
    nameOnCard: yup.string().required('Name on Card is required').max(40, 'Too long'),
    number: yup.number().required('Number is required').max(20, 'Too long').min(10, 'Too short'),
    expDate: yup.string().required('Expire Data is required').max(5, 'Too long').min(4, 'Too short'),
    cvc: yup.number().required('CVV is required').max(4, 'Too long').min(3, 'Too short'),
});

const schema = yup.object().shape({
    customer: personalDataSchema,
    address: deliveryDataSchema,
    card: paymentDataSchema,
}).required()

const Checkout: FC<Props> = ({ data }) => {

    const [activeStep, setActiveStep] = useState(0);
    const { register, handleSubmit, reset, setValue, formState: { errors }, } = useForm({ resolver: yupResolver(schema) });
    const methods = useForm();
    const router = useRouter();

    const handleNext = async () => {
        if (methods.formState.isValid) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }

    const handleReset = () => {
        setActiveStep(0);
        reset();
    }

    const onSubmit = async (formData: { customer: { name: string; lastName: string; email: string; }; address: { apartament?: string | null | undefined; address: string; city: string; state: string; zipCode: number; }; card: { number: number; nameOnCard: string; expDate: string; cvc: number; }; }) => {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        if (response.ok) {
            setActiveStep(steps.length);
            router.push({
                pathname: '/confirmacion-compra',
                query: { data: JSON.stringify(formData) }
            })
        }
    }

//TODO validacion
    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <TextField
                            label="Name"
                            required
                            {...methods.register('customer.name')}
                            error={errors?.customer?.name !== undefined}
                            helperText={errors.customer?.name?.message}
                        />
                        <TextField
                            label="LastName"
                            required
                            {...methods.register('customer.lastName')}
                            error={errors?.customer?.lastName !== undefined}
                            helperText={errors.customer?.lastName?.message}
                        />
                        <TextField
                            label="Email"
                            type='email'
                            required
                            {...methods.register('customer.email')}
                            error={errors?.customer?.email !== undefined}
                            helperText={errors.customer?.email?.message}
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <TextField
                            label="Address"
                            required
                            {...methods.register('address.address')}
                            error={errors?.address?.address !== undefined}
                            helperText={errors.address?.address?.message}
                        />
                        <TextField
                            label="Apartament, etc"
                            {...methods.register('address.apartament')}
                            error={errors?.address?.apartament !== undefined}
                            helperText={errors.address?.apartament?.message}
                        />
                        <TextField
                            label="City"
                            required
                            {...methods.register('address.city')}
                            error={errors?.address?.city !== undefined}
                            helperText={errors.address?.city?.message}
                        />
                        <TextField
                            label="Province"
                            required
                            {...methods.register('address.state')}
                            error={errors?.address?.state !== undefined}
                            helperText={errors.address?.state?.message}
                        />
                        <TextField
                            label="PostalCode"
                            required
                            {...methods.register('address.zipCode')}
                            error={errors?.address?.zipCode !== undefined}
                            helperText={errors.address?.zipCode?.message}
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <TextField
                            label="Name as it appears on the card"
                            required
                            {...methods.register('card.nameOnCard')}
                            error={errors?.card?.nameOnCard !== undefined}
                            helperText={errors.card?.nameOnCard?.message}
                        />
                        <TextField
                            label="CardNumber"
                            required
                            {...methods.register('card.number')}
                            error={errors?.card?.number !== undefined}
                            helperText={errors.card?.number?.message}
                        />
                        <TextField 
                            label="Expiry Data MM/YY" 
                            required
                            {...methods.register('card.expDate')}
                            error={errors?.card?.expDate !== undefined}
                            helperText={errors.card?.expDate?.message}
                        />
                        <TextField
                            label="CVV"
                            required
                            type='password'
                            {...methods.register('card.cvc')}
                            error={errors?.card?.cvc !== undefined}
                            helperText={errors.card?.cvc?.message}
                        />
                    </Box>
                )
            default:
                return null;
        }
    };
    return (
        <FormProvider {...methods}>
            <Typography variant='h4' textAlign={'center'} margin={5} color={"#0D47A1"}>{data.name}</Typography>
            <Box component='section' sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', alignContent: 'center', margin: '2vw 10rem' }}>
                <Box component='form' noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)} sx={{ marginX: 10 }}>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            return (
                                <Step key={index}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            )
                        })}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <React.Fragment>
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', pt: 2 }}>
                                <Link href={"/confirmacion-compra"}>
                                    <Button variant='contained'>Finish</Button>
                                </Link>
                            </Box>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <Typography sx={{ mt: 2, mb: 1, fontWeight: 700 }}>
                                {steps[activeStep]}
                            </Typography>
                            {getStepContent(activeStep)}
                            <Box sx={{ display: 'flex', flexDirection: 'row', padding: "20px" }}>
                                <Button
                                    variant='outlined'
                                    color='error'
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Prev
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button 
                                    variant='contained' 
                                    type='submit' 
                                    onClick={handleNext}
                                    disabled={!methods.formState.isValid}
                                >
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </Box>
                        </React.Fragment>
                    )}
                </Box>
                <Box>
                    <Card>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap',alignItems: 'center', width: '24vw', textAlign: 'center' }}>
                            <Image src={data.image} alt={data.name} width={200} height={200} />
                            <br />
                            <Typography variant='body1' color={"#0D47A1"}>{data.name}</Typography>
                            <br />
                            <Typography variant='body1' fontWeight={700} color={"#1E88E5"}>{`$ ${data.price}`}</Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
        </FormProvider>
    )
}

export default Checkout