export type CheckoutInput = {
    customer: {
        name: string,
        lastName: string,
        email: string
    }
    address: {
        address: string,
        apartament: string | null,
        city: string,
        state: string,
        zipCode: string
    },
    card: {
        number: string,
        cvv: number,
        expDate: string,
        nameOnCard: string
    },
    order: {
        name: string;
        image: string;
        price: number;
    }
}