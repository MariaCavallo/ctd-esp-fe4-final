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

interface FormValues {
    name: string;
    lastName: string;
    email: string;
    address: string;
    apartament?: string;
    city: string;
    state: string;
    zipCode: number;
    nameOnCard: string;
    number: number;
    expDate: string;
    cvv: number;
}

const steps = ['Datos Personales', 'Dirección de entrega', 'Datos del Pago'];

const schema = yup.object().shape({
    name: yup.string().required('Name is required').max(20, 'Too long').min(3, 'Too short'),
    lastName: yup.string().required('LastName is required').max(20, 'Too long').min(3, 'Too short'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    address: yup.string().required('Address is required').max(20, 'Too long').min(3, 'Too short'),
    apartament: yup.string().nullable(),
    city: yup.string().required('City is required').max(40, 'Too long').min(3, 'Too short'),
    state: yup.string().required('State is required').max(40, 'Too long').min(3, 'Too short'),
    zipCode: yup.number().required('ZipCode is required').max(10, 'Too long').min(4, 'Too short'),
    nameOnCard: yup.string().required('Name on Card is required').max(40, 'Too long'),
    number: yup.number().required('Number is required').max(20, 'Too long').min(10, 'Too short'),
    expDate: yup.string().required('Expire Data is required').max(5, 'Too long').min(4, 'Too short'),
    cvv: yup.number().required('CVV is required').max(4, 'Too long').min(3, 'Too short'),
})

const Checkout: FC<Props> = ({ data }) => {

    const [activeStep, setActiveStep] = useState(0);
    const { control, handleSubmit, reset, setValue, formState: { errors }, } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "Jhon",
            lastName: "James",
            email: "jhon.james@gmail.com",
            address: "4430 Erat Avenue",
            apartament: null,
            city: "New York",
            state: "Brooklyn",
            zipCode: 5225,
            nameOnCard: "Jhon James",
            number: 4242424242424242,
            expDate: "09/25",
            cvv: 123,
            },
    });
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

    const onSubmit: SubmitHandler<FormValues> = async (formData) => {
        const formattedData = {
            customer: {
                name: formData.name,
                lastName: formData.lastName,
                email: formData.email,
            },
            address: {
                address: formData.address,
                apartament: formData.apartament || null,
                city: formData.city,
                state: formData.state,
                zipCode:  formData.zipCode,
            },
            card: {
                nameOnCard: formData.nameOnCard,
                number: formData.number,
                expDate: formData.expDate,
                cvv: formData.cvv,
            }
        }
        localStorage.setItem('formattedData', JSON.stringify(formattedData));
        router.push({
            pathname: '/confirmacion-compra',
            query: { data: JSON.stringify(formData) }
        })
    }

    //TODO validaciones del form y del POST de la api devolviendo alerts
    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <FormControl error={errors?.name !== undefined}>
                            <InputLabel htmlFor="name">Name</InputLabel>
                            <Controller
                                control={control}
                                name="name"
                                defaultValue="Jhon"
                                render={({ field }) => <OutlinedInput {...field} />}
                            />
                            {errors?.name && (
                                <Typography variant="body2" color="error">
                                    {errors.name.message}
                                </Typography>
                            )}
                        </FormControl>
                        <FormControl error={errors?.lastName !== undefined}>
                            <InputLabel htmlFor="lastName">LastName</InputLabel>
                            <Controller
                                control={control}
                                name="lastName"
                                defaultValue="James"
                                render={({ field }) => <OutlinedInput {...field} />}
                            />
                            {errors?.lastName && (
                                <Typography variant="body2" color="error">
                                    {errors.lastName.message}
                                </Typography>
                            )}
                        </FormControl>
                        <FormControl error={errors?.email !== undefined}>
                            <InputLabel htmlFor="email">Email</InputLabel>
                            <Controller
                                control={control}
                                name="email"
                                defaultValue="jhon.james@gmail.com"
                                render={({ field }) => <OutlinedInput {...field} />}
                            />
                            {errors?.email && (
                                <Typography variant="body2" color="error">
                                    {errors.email.message}
                                </Typography>
                            )}
                        </FormControl>
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <FormControl error={errors?.address !== undefined}>
                            <InputLabel htmlFor="address">Address</InputLabel>
                            <Controller
                                control={control}
                                name="address"
                                defaultValue="4430 Erat Avenue"
                                render={({ field }) => <OutlinedInput {...field} />}
                            />
                            {errors?.address && (
                                <Typography variant="body2" color="error">
                                    {errors.address.message}
                                </Typography>
                            )}
                        </FormControl>
                        <FormControl error={errors?.apartament !== undefined}>
                            <InputLabel htmlFor="apartament">Apartament, etc</InputLabel>
                            <Controller
                                control={control}
                                name="apartament"
                                defaultValue=""
                                render={({ field }) => <OutlinedInput {...field} />}
                            />
                            {errors?.apartament && (
                                <Typography variant="body2" color="error">
                                    {errors?.apartament.message}
                                </Typography>
                            )}
                        </FormControl>
                        <FormControl error={errors?.city !== undefined}>
                            <InputLabel htmlFor="city">City</InputLabel>
                            <Controller
                                control={control}
                                name="city"
                                defaultValue="New York"
                                render={({ field }) => <OutlinedInput {...field} />}
                            />
                            {errors?.city && (
                                <Typography variant="body2" color="error">
                                    {errors?.city.message}
                                </Typography>
                            )}
                        </FormControl>
                        <FormControl error={errors?.state !== undefined}>
                            <InputLabel htmlFor="address.state">Province</InputLabel>
                            <Controller
                                control={control}
                                name="state"
                                defaultValue="Brooklyn"
                                render={({ field }) => <OutlinedInput {...field} />}
                            />
                            {errors?.state && (
                                <Typography variant="body2" color="error">
                                    {errors?.state.message}
                                </Typography>
                            )}
                        </FormControl>
                        <FormControl error={errors?.zipCode !== undefined}>
                            <InputLabel htmlFor="zipCode">ZipCode</InputLabel>
                            <Controller
                                control={control}
                                name="zipCode"
                                defaultValue={5225}
                                render={({ field }) => <OutlinedInput {...field} />}
                            />
                            {errors?.zipCode && (
                                <Typography variant="body2" color="error">
                                    {errors?.zipCode.message}
                                </Typography>
                            )}
                        </FormControl>
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <FormControl error={errors?.nameOnCard !== undefined}>
                            <InputLabel htmlFor="nameOnCard">Name as it appears on the card</InputLabel>
                            <Controller
                                control={control}
                                name="nameOnCard"
                                defaultValue="Jhon James"
                                render={({ field }) => <OutlinedInput {...field} />}
                            />
                            {errors?.nameOnCard && (
                                <Typography variant="body2" color="error">
                                    {errors?.nameOnCard.message}
                                </Typography>
                            )}
                        </FormControl>
                        <FormControl error={errors?.number !== undefined}>
                            <InputLabel htmlFor="number">Card number</InputLabel>
                            <Controller
                                control={control}
                                name="number"
                                defaultValue={4242424242424242}
                                render={({ field }) => <OutlinedInput {...field} />}
                            />
                            {errors?.number && (
                                <Typography variant="body2" color="error">
                                    {errors?.number.message}
                                </Typography>
                            )}
                        </FormControl>
                        <FormControl error={errors?.expDate !== undefined}>
                            <InputLabel htmlFor="expDate">Expiry Data MM/YY</InputLabel>
                            <Controller
                                control={control}
                                name="expDate"
                                defaultValue="09/25"
                                render={({ field }) => <OutlinedInput {...field} />}
                            />
                            {errors?.expDate && (
                                <Typography variant="body2" color="error">
                                    {errors?.expDate.message}
                                </Typography>
                            )}
                        </FormControl>
                        <FormControl error={errors?.cvv !== undefined}>
                            <InputLabel htmlFor="cvv">CVV</InputLabel>
                            <Controller
                                control={control}
                                name="cvv"
                                defaultValue={123}
                                render={({ field }) => <OutlinedInput {...field} />}
                            />
                            {errors?.cvv && (
                                <Typography variant="body2" color="error">
                                    {errors?.cvv.message}
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