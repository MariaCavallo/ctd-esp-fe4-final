import React, { FC, SyntheticEvent, forwardRef, useState } from 'react'
import { Box, Button, Card, CardContent, Snackbar, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material'
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert';
import Image from 'next/image';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { CheckoutInput } from 'src/features/checkout/checkout.types';
import { Controller, FormProvider, Resolver, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { info } from 'console';
import { validCard } from 'src/pages/api/checkout.route';
import { ERROR_INCORRECT_ADDRESS, ERROR_CARD_WITHOUT_FUNDS, ERROR_CARD_WITHOUT_AUTHORIZATION, ERROR_CARD_DATA_INCORRECT } from 'src/services/checkout/checkout.errors';

interface Props {
    data: CheckoutInput['order'];
}

type FormValues = {
    name: string;
    lastName: string;
    email: string;
    address: string;
    apartament: string;
    city: string;
    state: string;
    zipCode: string;
    nameOnCard: string;
    number: string;
    expDate: string;
    cvv: string;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
});

const steps = ['Datos Personales', 'Dirección de entrega', 'Datos del Pago'];

const schema = yup.object().shape({
    name: yup.string().required('Name is required').matches(/^[A-Za-z\s]+$/, 'Name must contain only letters and spaces').max(20, 'Too long').min(3, 'Too short'),
    lastName: yup.string().required('LastName is required').matches(/^[A-Za-z\s]+$/, 'LastName must contain only letters and spaces').max(20, 'Too long').min(3, 'Too short'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    address: yup.string().required('Address is required').max(20, 'Too long').min(3, 'Too short'),
    apartament: yup.string(),
    city: yup.string().required('City is required').matches(/^[A-Za-z\s]+$/, 'City must contain only letters and spaces').max(40, 'Too long').min(3, 'Too short'),
    state: yup.string().required('State is required').matches(/^[A-Za-z\s]+$/, 'State must contain only letters and spaces').max(40, 'Too long').min(3, 'Too short'),
    zipCode: yup.string().required('ZipCode is required').matches(/^\d+$/, 'ZipCode must be a number').min(2, 'Too short').max(8, 'Too long'),
    nameOnCard: yup.string().required('Name on Card is required').matches(/^[A-Za-z\s]+$/, 'NameOfCard must contain only letters and spaces').max(40, 'Too long'),
    number: yup.string().required('Number of Card is required').matches(/^\d+$/, 'NumberOfCard must be a number').min(14, 'Too short').max(16, 'Too long'),
    expDate: yup.string().required('Expire Data is required').max(5, 'Too long').min(4, 'Too short'),
    cvv: yup.string().required('cvv is required').matches(/^\d+$/, 'cvv must be a number').min(2, 'Too short').max(5, 'Too long'),
})

const Checkout: FC<Props> = ({ data }) => {

    const [activeStep, setActiveStep] = useState(0);
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("")

    const { control, handleSubmit, trigger } = useForm<FormValues>({
        resolver: yupResolver(schema) as Resolver<FormValues>,
        defaultValues: {
            name: "Jhon",
            lastName: "James",
            email: "jhon.james@gmail.com",
            address: "4430 Erat Avenue",
            apartament: "",
            city: "New York",
            state: "Brooklyn",
            zipCode: "5225",
            nameOnCard: "Jhon James",
            number: "4242424242424242",
            expDate: "09/25",
            cvv: "123",
        },
    });
    const methods = useForm();

    const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        let isValid = false;

        switch (activeStep) {
            case 0:
                isValid = await trigger([
                    "name",
                    "lastName",
                    "email"
                ])
                break;
            case 1:
                isValid = await trigger([
                    "address",
                    "apartament",
                    "city",
                    "state",
                    "zipCode"
                ])
                break;
            case 2:
                isValid = await trigger([
                    "nameOnCard",
                    "number",
                    "expDate",
                    "cvv"
                ])
                break;
        }

        if (isValid) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }

        if (activeStep === steps.length - 1) {
            handleSubmit(onSubmit)
        }
    }

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }

    const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const onSubmit: SubmitHandler<FormValues> = async (formData) => {
        const formattedData = {
            customer: {
                name: formData.name,
                lastName: formData.lastName,
                email: formData.email,
            },
            address: {
                address: formData.address,
                apartament: formData.apartament || "",
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
            },
            card: {
                nameOnCard: formData.nameOnCard,
                number: formData.number,
                expDate: formData.expDate,
                cvv: formData.cvv,
            },
            order: {
                name: data?.name,
                image: data?.image,
                price: data?.price,
            }
        }

        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formattedData)
        })
        const response = await res.json()
        console.log(response);

        if (!response?.card) {
            switch (response?.message) {
                case ERROR_INCORRECT_ADDRESS.message:
                case ERROR_CARD_WITHOUT_FUNDS.message:
                case ERROR_CARD_WITHOUT_AUTHORIZATION.message:
                case ERROR_CARD_DATA_INCORRECT.message:
                    setOpen(true)
                    setAlertMessage(response.message)
                    break;
            }
        }
        if (!response.ok) {
            setAlertMessage(response.message)
            setOpen(true)
        } else {
            localStorage.setItem('formData', JSON.stringify(formattedData));
            window.location.href = "/confirmacion-compra/";
        }
    }

    const getStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <Controller
                            control={control}
                            name="name"
                            rules={{ required: 'Name is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    id='name'
                                    label="Name"
                                    variant="outlined"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                />)}
                        />
                        <Controller
                            control={control}
                            name="lastName"
                            rules={{ required: 'LastName is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    id='lastName'
                                    label="LastName"
                                    variant="outlined"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                />)}
                        />
                        <Controller
                            control={control}
                            name="email"
                            rules={{ required: 'Email is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    id='email'
                                    label="Email"
                                    variant="outlined"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                />)}
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <Controller
                            control={control}
                            name="address"
                            rules={{ required: 'Address is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    id='address'
                                    label="Address"
                                    variant="outlined"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                />)}
                        />
                        <Controller
                            control={control}
                            name="apartament"
                            render={({ field, fieldState }) => (
                                <TextField
                                    id='apartament'
                                    label="Apartament"
                                    variant="outlined"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                />)}
                        />
                        <Controller
                            control={control}
                            name="city"
                            rules={{ required: 'City is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    id='city'
                                    label="City"
                                    variant="outlined"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                />)}
                        />
                        <Controller
                            control={control}
                            name="state"
                            rules={{ required: 'State is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    id='state'
                                    label="State"
                                    variant="outlined"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                />)}
                        />
                        <Controller
                            control={control}
                            name="zipCode"
                            rules={{ required: 'ZipCode is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    id='zipCode'
                                    label="Zip Code"
                                    variant="outlined"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                />)}
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <Controller
                            control={control}
                            name="nameOnCard"
                            rules={{ required: 'NameOnCard is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    id='nameOnCard'
                                    label="Name on Card"
                                    variant="outlined"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                />)}
                        />
                        <Controller
                            control={control}
                            name="number"
                            rules={{ required: 'Number is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    id='number'
                                    label="Number"
                                    variant="outlined"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                />)}
                        />
                        <Controller
                            control={control}
                            name="expDate"
                            rules={{ required: 'ExpiryDate is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    id='expDate'
                                    label="Expiry Date"
                                    variant="outlined"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                />)}
                        />
                        <Controller
                            control={control}
                            name="cvv"
                            rules={{ required: 'cvv is required' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    id='cvv'
                                    label="CVV"
                                    variant="outlined"
                                    type='password'
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    error={!!fieldState?.error}
                                    helperText={fieldState?.error?.message}
                                />)}
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
                <Box component='form' noValidate autoComplete="off" sx={{ marginX: 10 }}>
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
                            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', pt: 2, gap: '20px' }}>
                                <Button
                                    variant='outlined'
                                    color='error'
                                    onClick={handleBack}
                                >
                                    Return
                                </Button>
                                <Link href={"/confirmacion-compra"}>
                                    <Button
                                        variant='contained'
                                        type='submit'
                                        onClick={handleSubmit(onSubmit)}
                                    >
                                        Finish
                                    </Button>
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
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity={"error"} sx={{ width: '100%' }}>
                        {alertMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </FormProvider>
    )
}

export default Checkout