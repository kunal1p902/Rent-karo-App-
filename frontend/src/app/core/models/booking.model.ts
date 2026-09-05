export interface Booking {
  _id: string;
  bookingId: string;
  userId: any;
  ownerId: any;
  vehicleId: any;
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  quantity: number;
  rentalDuration: number;
  rentalAmount: number;
  securityDeposit: number;
  additionalCharges: number;
  totalAmount: number;
  paymentStatus: string;
  bookingStatus: string;
  cancellationReason?: string;
  createdAt?: string;
}
