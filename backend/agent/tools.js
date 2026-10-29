import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { readJson, writeJson } from '../utils/db.js';

// Tool 1: Fetch trip plans & hotels
export const getTripInfoTool = tool(
  async () => {
    const plans = await readJson('plans.json');
    const hotels = await readJson('hotels.json');
    const faqs = await readJson('faqs.json');
    return JSON.stringify({ plans, hotels, faqs });
  },
  {
    name: 'get_trip_info',
    description: 'Retrieves all available tour packages, hotel options, and FAQ policy information.',
    schema: z.object({})
  }
);

// Tool 2: Book trip and persist into bookings.json
export const saveBookingTool = tool(
  async ({ customerName, customerEmail, destination, packageTitle, guests, startDate }) => {
    try {
      // 1. Catalog Validation: Check if package/destination exists in plans.json
      const plans = await readJson('plans.json');
      const isValidPlan = plans.some(plan => 
        (plan.title && plan.title.toLowerCase().includes(packageTitle.toLowerCase())) ||
        (plan.destination && plan.destination.toLowerCase().includes(destination.toLowerCase())) ||
        (packageTitle && packageTitle.toLowerCase().includes(plan.title?.toLowerCase()))
      );

      if (!isValidPlan) {
        return "Sorry, I can't book your trip because this package or destination is not available in our catalog.";
      }

      // 2. Date Validation: Past date check & 6-month limit check
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize time

      const tripStartDate = new Date(startDate);
      tripStartDate.setHours(0, 0, 0, 0);

      // If trip start date is in the past
      if (tripStartDate < today) {
        return "Sorry I can't book your trip for this date.";
      }

      // If trip start date is more than 6 months from today
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      sixMonthsFromNow.setHours(0, 0, 0, 0);

      if (tripStartDate > sixMonthsFromNow) {
        return "Sorry I can't book your trip for this date.";
      }

      // 3. Save Booking
      const bookings = await readJson('bookings.json');
      const newBooking = {
        id: `bk-${Date.now()}`,
        customerName,
        customerEmail,
        destination,
        packageTitle,
        guests,
        startDate,
        createdAt: new Date().toISOString(),
        status: 'Confirmed'
      };

      bookings.push(newBooking);
      await writeJson('bookings.json', bookings);
      return `Booking successfully created! Reference ID: ${newBooking.id}`;
    } catch (error) {
      return `Error creating booking: ${error.message}`;
    }
  },
  {
    name: 'save_booking',
    description: 'Saves a completed trip booking into the system once customer name, email, destination, guests, and start date are confirmed. Fails if the package/destination is not in plans.json, or if the date is in the past/more than 6 months away.',
    schema: z.object({
      customerName: z.string().describe('Full name of the primary guest'),
      customerEmail: z.string().describe('Email address for booking updates'),
      destination: z.string().describe('Target travel destination'),
      packageTitle: z.string().describe('Title of chosen tour package'),
      guests: z.number().describe('Total count of travelers'),
      startDate: z.string().describe('Trip start date (YYYY-MM-DD)')
    })
  }
);

// Tool 3: Retrieve all bookings for a specific signed-in user
export const getUserBookingsTool = tool(
  async ({ userEmail }) => {
    try {
      console.log('🔍 Executing get_user_bookings for email:', userEmail);

      if (!userEmail || userEmail === 'Not provided') {
        return JSON.stringify({
          status: 'error',
          message: 'No valid user email provided from authentication session.'
        });
      }

      const bookings = await readJson('bookings.json');
      console.log('📂 Total bookings in database:', bookings.length);

      const userBookings = bookings.filter(
        (b) => b.customerEmail && b.customerEmail.trim().toLowerCase() === userEmail.trim().toLowerCase()
      );

      console.log(`✅ Found ${userBookings.length} booking(s) for ${userEmail}`);

      if (userBookings.length === 0) {
        return JSON.stringify({
          status: 'info',
          message: `No active or past bookings found for ${userEmail}.`,
          bookings: []
        });
      }

      return JSON.stringify({
        status: 'success',
        userEmail,
        bookings: userBookings
      });
    } catch (error) {
      console.error('❌ Error reading bookings:', error);
      return JSON.stringify({
        status: 'error',
        message: `Failed to retrieve user bookings: ${error.message}`
      });
    }
  },
  {
    name: 'get_user_bookings',
    description: 'Fetches all active and past trip bookings stored for the logged-in user email.',
    schema: z.object({
      userEmail: z.string().describe('Email address of the logged-in user')
    })
  }
);

// Tool 4: Update an existing booking in bookings.json
export const updateBookingTool = tool(
  async ({ bookingId, guests, startDate }) => {
    try {
      const bookings = await readJson('bookings.json');
      const bookingIndex = bookings.findIndex((b) => b.id === bookingId);

      if (bookingIndex === -1) {
        return `Error: Booking with ID ${bookingId} was not found.`;
      }

      const bookingToUpdate = bookings[bookingIndex];

      // Current time and original trip start date
      const now = new Date();
      const tripStartDate = new Date(bookingToUpdate.startDate);

      // 1. If the trip start date is already in the past (e.g., trip was June 10, 2025 and today is after June 10)
      if (tripStartDate < now) {
        return "Sorry but now you can't change the booking.";
      }

      // 2. Calculate hours remaining until the trip starts
      const timeDiffInMs = tripStartDate.getTime() - now.getTime();
      const hoursUntilTrip = timeDiffInMs / (1000 * 60 * 60);

      // Check if time remaining is less than 24 hours (1 day)
      if (hoursUntilTrip < 24) {
        return "Sorry but now you can't change the booking.";
      }

      // Update fields if provided
      if (guests !== undefined) {
        bookings[bookingIndex].guests = guests;
      }
      if (startDate !== undefined) {
        bookings[bookingIndex].startDate = startDate;
      }

      bookings[bookingIndex].updatedAt = new Date().toISOString();

      await writeJson('bookings.json', bookings);
      return `Booking ${bookingId} successfully updated! Updated details: Guests - ${bookings[bookingIndex].guests}, Start Date - ${bookings[bookingIndex].startDate}`;
    } catch (error) {
      return `Error updating booking: ${error.message}`;
    }
  },
  {
    name: 'update_booking',
    description: 'Updates details such as guest count or start date for an existing booking using its booking ID, only if the trip start date is in the future and at least 24 hours away.',
    schema: z.object({
      bookingId: z.string().describe('The reference ID of the booking to update (e.g., bk-17123456789)'),
      guests: z.number().optional().describe('New total count of guests'),
      startDate: z.string().optional().describe('New travel start date (YYYY-MM-DD)')
    })
  }
);