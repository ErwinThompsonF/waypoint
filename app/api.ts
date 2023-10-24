import axios from 'axios';

const host = process.env.API_HOST

export const submitAddressRequest = async (pickupAddress: string, dropoffAddress: string) => {
    try {
        const submitResponse = await axios.post(
            `${host}/route`,
            {
                origin: pickupAddress,
                destination: dropoffAddress,
            }
        );
        return submitResponse.data.token;
    } catch (error) {
        throw new Error('Failed to request a valid token');
    }
};

export const checkAddressStatus = async (token: string) => {
    try {
      const statusResponse = await axios.get(`${host}/route/${token}`);
      const { status } = statusResponse.data;
  
      if (status === 'in progress') {
        // Recursive call after 1 second
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return checkAddressStatus(token);
      }
  
      return statusResponse.data;
    } catch (error) {
      throw new Error('Failed to fetch address waypoints');
    }
  };