import { ReactNode } from "react";

export interface IUser {
    full_name: string;
    email: string;
    address: string;
    role: string;
    id: string;
    department_name: string;
    image: string;
    rank: string;
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
    id: string;
    theme_description: string;
    type: string;
    venue: string;
    image:string;
    title: string;
    img: string;
    location: string;
    start_date: string;
    end_date: string;
    event_link: string;
}