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