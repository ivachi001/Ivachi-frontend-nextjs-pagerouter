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

export const apiErrors = (res: any) => {
  const response = res ? res.response : undefined;
  if (response && response.data && response.status === 400) {
      notify.error(response.data && response.data.message ? response.data.message : 'Something went wrong, please try again later.')
  } else {
      const message = response?.data && response?.data?.message;
      notify.error(message ? message : 'Something went wrong please try again later.');
  }
}

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