import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const setBG = (url: string) => {
  return {
    style: {
      backgroundImage: `url(${url})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }
  }
}

export const HEADER_HEIGHT = 80;
export const USER_PLACEHOLDER_IMG_URL = '/images/placeholder.svg';
export const PLACEHOLDER_IMG_URL = '/images/placeholder2.png';


// localstorage getter

export const local = (name: string, val?: string): any | void => {
  const NF_PREFIX = 'NF_';
  const key = NF_PREFIX + name;

  if (val) return localStorage.setItem(key, val);
  else {
    const data = localStorage.getItem(key);
    return data ? data.includes('{') ? JSON.parse(data) : data : null;
  }
}

export const local_clear = () => localStorage.clear();

export const removeBase64 = (data: string) => {
  const base64Regex = /^data:[^;]*;base64,/i;
  const match = base64Regex.exec(data);

  if (match) {
    return data.substring(match[0].length); 
  } else {
    return data; 
  }
}