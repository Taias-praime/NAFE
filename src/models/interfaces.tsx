import { ReactNode } from "react";

export interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    address: string;
    role: string;
}

export interface IMenu {
    icon: any;
    label: string;
    link: string;
    handleClick?: () => void; 
}

export interface ICard {
    type?: 'default' | 'stats',
    title?: string;
    cta?: string;
    ctaIcon?: ReactNode;
    img?: string | ReactNode;
    className?: string;
    stat?: number;
}

export interface IEvent {
    title: string;
    img: string;
    location: string;
    startDate: string;
    endDate: string;
}