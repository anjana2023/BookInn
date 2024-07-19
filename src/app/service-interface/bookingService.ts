import { BookingServiceReturnType } from "../../frameworks/servies/bookingService";

export const bookingServiceInterface = (service: BookingServiceReturnType) => {
  const dateDifference = async (
    date1: string | number | Date,
    date2: string | number | Date
  ) => service.dateDifference(date1, date2);

  return {
    dateDifference,
  };
};

export type BookingServiceInterface = typeof bookingServiceInterface;
