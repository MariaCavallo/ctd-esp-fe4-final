import React, { FC, useEffect, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, FormControl, Input, InputLabel, OutlinedInput, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material'
import Image from 'next/image';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckoutInput } from 'src/features/checkout/checkout.types';
import { Controller, FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Props {
    data: CheckoutInput['order'];
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
    zipCode: yup.string().required('ZipCode is required').max(10, 'Too long').min(4, 'Too short'),
})

const paymentDataSchema = yup.object().shape({
    nameOnCard: yup.string().required('Name on Card is required').max(40, 'Too long'),
    number: yup.string().required('Number is required').max(20, 'Too long').min(10, 'Too short'),
    expDate: yup.string().required('Expire Data is required').max(5, 'Too long').min(4, 'Too short'),
    cvv: yup.number().required('CVV is required').max(4, 'Too long').min(3, 'Too short'),
});

const schema = yup.object().shape({
    customer: personalDataSchema,
    address: deliveryDataSchema,
    card: paymentDataSchema,
}).required()

const Checkout: FC<Props> = ({ data }) => {

    const [activeStep, setActiveStep] = useState(0);
    const { control, handleSubmit, reset, setValue, formState: { errors }, } = useForm({ resolver: yupResolver(schema) });
    const methods = useForm()
    const router = useRouter();

    const handleNext = () => {
        if (Object.keys(errors).length === 0) {
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

    const onSubmit = async (formData: { customer: { name: string; lastName: string; email: string; }; address: { apartament?: string | null | undefined; address: string; city: string; state: string; zipCode: string; }; card: { number: string; nameOnCard: string; expDate: string; cvv: number; }; }) => {
        localStorage.setItem('formData', JSON.stringify(formData));
        router.push({
            pathname: '/confirmacion-compra',
            query: { data: JSON.stringify(formData) }
        })
    }

    useEffect(() => {
        const storedData = localStorage.getItem('formData');
        if (storedData) {
            setValue('customer', JSON.parse(storedData).customer);
            setValue('address', JSON.parse(storedData).address);
            setValue('card', JSON.parse(storedData).card);
        }
    }, [setValue])

    //TODO validaciones del form y del POST de la api devolviendo alerts
    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <FormControl error={errors?.customer?.name !== undefined}>
                            <InputLabel htmlFor="customer.name">Name</InputLabel>
                            <Controller
                            control={control}
                            name="customer.name"
                            defaultValue="Jhon"
                            render={({ field }) => <OutlinedInput {...field} />}
                        />
                        {errors?.customer?.name && (
                            <Typography variant="body2" color="error">
                                {errors.customer.name.message}
                            </Typography>
                        )}
                    </FormControl>
                    <FormControl error={errors?.customer?.lastName !== undefined}>
                        <InputLabel htmlFor="customer.lastName">LastName</InputLabel>
                        <Controller
                            control={control}
                            name="customer.lastName"
                            defaultValue="James"
                            render={({ field }) => <OutlinedInput {...field} />}
                        />
                        {errors?.customer?.lastName && (
                            <Typography variant="body2" color="error">
                                {errors.customer.lastName.message}
                            </Typography>
                        )}
                    </FormControl>
                    <FormControl error={errors?.customer?.email !== undefined}>
                        <InputLabel htmlFor="customer.email">Email</InputLabel>
                        <Controller
                            control={control}
                            name="customer.email"
                            defaultValue="jhon.james@gmail.com"
                            render={({ field }) => <OutlinedInput {...field} />}
                        />
                        {errors?.customer?.email && (
                            <Typography variant="body2" color="error">
                                {errors.customer.email.message}
                            </Typography>
                        )}
                    </FormControl>
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <FormControl error={errors?.address?.address !== undefined}>
                        <InputLabel htmlFor="address.address">Address</InputLabel>
                        <Controller
                            control={control}
                            name="address.address"
                            defaultValue="4430 Erat Avenue"
                            render={({ field }) => <OutlinedInput {...field} />}
                        />
                        {errors?.address?.address && (
                            <Typography variant="body2" color="error">
                                {errors.address.address.message}
                            </Typography>
                        )}
                    </FormControl>
                    <FormControl error={errors?.address?.apartament !== undefined}>
                        <InputLabel htmlFor="address.apartament">Apartament, etc</InputLabel>
                        <Controller
                            control={control}
                            name="address.apartament"
                            defaultValue=""
                            render={({ field }) => <OutlinedInput {...field} />}
                        />
                        {errors?.address?.apartament && (
                            <Typography variant="body2" color="error">
                                {errors.address.apartament.message}
                            </Typography>
                        )}
                    </FormControl>
                    <FormControl error={errors?.address?.city !== undefined}>
                        <InputLabel htmlFor="address.city">City</InputLabel>
                        <Controller
                            control={control}
                            name="address.city"
                            defaultValue="New York"
                            render={({ field }) => <OutlinedInput {...field} />}
                        />
                        {errors?.address?.city && (
                            <Typography variant="body2" color="error">
                                {errors.address.city.message}
                            </Typography>
                        )}
                    </FormControl>
                    <FormControl error={errors?.address?.state !== undefined}>
                        <InputLabel htmlFor="address.state">Province</InputLabel>
                        <Controller
                            control={control}
                            name="address.state"
                            defaultValue="Brooklyn"
                            render={({ field }) => <OutlinedInput {...field} />}
                        />
                        {errors?.address?.state && (
                            <Typography variant="body2" color="error">
                                {errors.address.state.message}
                            </Typography>
                        )}
                    </FormControl>
                    <FormControl error={errors?.address?.zipCode !== undefined}>
                        <InputLabel htmlFor="address.zipCode">ZipCode</InputLabel>
                        <Controller
                            control={control}
                            name="address.zipCode"
                            defaultValue="5225"
                            render={({ field }) => <OutlinedInput {...field} />}
                        />
                        {errors?.address?.zipCode && (
                            <Typography variant="body2" color="error">
                                {errors.address.zipCode.message}
                            </Typography>
                        )}
                    </FormControl>
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <FormControl error={errors?.card?.nameOnCard !== undefined}>
                        <InputLabel htmlFor="card.nameOnCard">Name as it appears on the card</InputLabel>
                        <Controller
                            control={control}
                            name="card.nameOnCard"
                            defaultValue="Jhon James"
                            render={({ field }) => <OutlinedInput {...field} />}
                        />
                        {errors?.card?.nameOnCard && (
                            <Typography variant="body2" color="error">
                                {errors.card.nameOnCard.message}
                            </Typography>
                        )}
                    </FormControl>
                    <FormControl error={errors?.card?.number !== undefined}>
                        <InputLabel htmlFor="card.number">Card number</InputLabel>
                        <Controller
                            control={control}
                            name="card.number"
                            defaultValue="4242 4242 4242 4242"
                            render={({ field }) => <OutlinedInput {...field} />}
                        />
                        {errors?.card?.number && (
                            <Typography variant="body2" color="error">
                                {errors.card.number.message}
                            </Typography>
                        )}
                    </FormControl>
                    <FormControl error={errors?.card?.expDate !== undefined}>
                        <InputLabel htmlFor="card.expDate">Expiry Data MM/YY</InputLabel>
                        <Controller
                            control={control}
                            name="card.expDate"
                            defaultValue="09/25"
                            render={({ field }) => <OutlinedInput {...field} />}
                        />
                        {errors?.card?.expDate && (
                            <Typography variant="body2" color="error">
                                {errors.card.expDate.message}
                            </Typography>
                        )}
                    </FormControl>
                    <FormControl error={errors?.card?.cvv !== undefined}>
                        <InputLabel htmlFor="card.cvv">CVV</InputLabel>
                        <Controller
                            control={control}
                            name="card.cvv"
                            defaultValue={123}
                            render={({ field }) => <OutlinedInput {...field} />}
                        />
                        {errors?.card?.cvv && (
                            <Typography variant="body2" color="error">
                                {errors.card.cvv.message}
                            </Typography>
                        )}
                    </FormControl>
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
                                >
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </Box>
                        </React.Fragment>
                    )}
                </Box>
                <Box>
                    <Card>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignItems: 'center', width: '24vw', textAlign: 'center' }}>
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