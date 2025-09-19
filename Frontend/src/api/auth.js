// This function will handle the registration API call
export const apiRegister = async (userData) => {
  try {
    const response = await fetch('/api/v1/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    // The backend sends a `success: false` for errors, so we check for that
    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    // Re-throw the error to be caught by the component
    throw error;
  }
};

// This function will handle the login API call
export const apiLogin = async (userData) => {
  try {
    const response = await fetch('/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

