export interface Address {

    id?: number;

    userId?: number;

    fullName: string;

    mobileNumber: string;

    addressLine1: string;

    addressLine2?: string;

    city: string;

    state: string;

    pincode: string;

    landmark?: string;

    addressType: string;

    isDefault?: boolean;

}