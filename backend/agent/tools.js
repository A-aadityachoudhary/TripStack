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
  },
  {
    name: 'save_booking',
    description: 'Saves a completed trip booking into the system once customer name, email, destination, guests, and start date are confirmed.',
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
      const bookings = await readJson('bookings.json');
      const userBookings = bookings.filter(
        (b) => b.customerEmail?.toLowerCase() === userEmail?.toLowerCase()
      );
      
      if (userBookings.length === 0) {
        return JSON.stringify({ status: 'info', message: 'No active or past bookings found for this email.', bookings: [] });
      }

      return JSON.stringify({ status: 'success', bookings: userBookings });
    } catch (error) {
      return JSON.stringify({ status: 'error', message: 'Failed to retrieve user bookings.' });
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
    description: 'Updates details such as guest count or start date for an existing booking using its booking ID.',
    schema: z.object({
      bookingId: z.string().describe('The reference ID of the booking to update (e.g., bk-17123456789)'),
      guests: z.number().optional().describe('New total count of guests'),
      startDate: z.string().optional().describe('New travel start date (YYYY-MM-DD)')
    })
  }
);