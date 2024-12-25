import { message } from 'antd';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export const notify = {
  success: (msg: string) => message.success(msg),
  error: (msg: string) => message.error(msg),
  warning: (msg: string) => message.warning(msg),
  info: (msg: string) => message.info(msg),
};

export const apiErrors = (error: any) => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse;
    
    // Handle different error scenarios
    if (error.response?.status === 401) {
      notify.error(response?.message || 'Unauthorized access');
      handleUnauthorize();
      return;
    }

    if (error.response?.status === 403) {
      notify.error(response?.message || 'Access forbidden');
      return;
    }

    if (error.response?.status === 422) {
      // Validation errors
      if (response.errors) {
        // Get first validation error message
        const firstError = Object.values(response.errors)[0]?.[0];
        notify.error(firstError || 'Validation failed');
        return;
      }
    }

    if (error.response?.status === 404) {
      notify.error(response?.message || 'Resource not found');
      return;
    }

    if (error.response?.status >= 500) {
      notify.error('Server error. Please try again later.');
      return;
    }

    // Default error message
    notify.error(
      response?.message || 
      error.message || 
      'Something went wrong. Please try again.'
    );
  } else {
    // Handle non-Axios errors
    notify.error('An unexpected error occurred');
  }
};

export const handleUnauthorize = () => {
  Cookies.remove('authToken');
  localStorage.removeItem("isWorkShopModalVisible");
  window.location.href = "/login";
};

export const onPageBackButtonClick = () => {
    if (window) {
        window.history.back()
    }
}


export const logout = () => {
    Cookies.remove('authToken')
    localStorage.clear()
    localStorage.removeItem("persist:root");
    sessionStorage.clear();
    window.location.href = "/login"
}

//Keydown validations
export const onKeyDownNumberOnly: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    // Allow numbers, backspace, arrow keys, and decimal point (.)
    if (
        !/[0-9]/.test(event.key) &&
        event.key !== 'Backspace' &&
        event.key !== 'ArrowLeft' &&
        event.key !== 'ArrowRight' &&
        event.key !== '.'
    ) {
        event.preventDefault();
    }

    // Prevent multiple decimal points
    const inputValue = event.currentTarget.value;
    if (event.key === '.' && inputValue.includes('.')) {
        event.preventDefault();
    }
};


export const onKeyDownFloatOnly = (e: any) => {
    if (/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~a-zA-Z]/.test(e.key) || (e.key === '.' && e.target.value.includes('.'))) {
        e.preventDefault();
    }
}

export const disableInputPaste = (e: any) => {
    e.preventDefault(); // Prevent the default paste behavior
};

export const onKeyDownAlphabetsAndNumbersOnly = (e: any) => {
    if (/[`!@#$%^&*()+\-=\[\]{};':"\\|_,.<>?~/]/.test(e.key)) {
        e.preventDefault();
    }
}

export const onKeyDownAlphabetOnly = (e: any) => {
    if (/[`!@#$%^&*()+\-=\[\]{};':"\\|_,.<>?~0-9]/.test(e.key)) {
        e.preventDefault();
    }
}