import { Rule } from 'antd/es/form';

/** Field required validation */
export const required = (message: string = 'This field is required'): Rule => ({
    required: true,
    message,
});

/** Field email validation */
export const checkEmail = (message: string = 'Please enter a valid email'): Rule => ({
    type: 'email',
    message,
});

/** Field min length validation */
export const minLength = (min: number, message?: string): Rule => ({
    min,
    message: message || `Minimum ${min} characters required`,
});

/** Field max length validation */
export const maxLength = (max: number, message?: string): Rule => ({
    max,
    message: message || `Maximum ${max} characters allowed`,
});

/** Field whitespace validation */
export const whiteSpace = (): Rule => ({
    whitespace: true,
    message: 'Whitespace is not allowed'
});


export const validateNoWhitespace = (value: string, message: string = "No leading or trailing whitespace allowed"): Promise<void> => {
    if (value && (value !== value.trim())) {
        return Promise.reject(new Error(message));
    }
    return Promise.resolve();
};