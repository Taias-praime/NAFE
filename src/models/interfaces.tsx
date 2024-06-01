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

export interface ITenants {
    tenant_id: string;
    name: string;
    code: string;
    total_events: number;
    total_members: number;
    webinars: number;
  }
  
  export interface IAnnouncements {
    id: string;
    date_created: string;
    date_updated: string;
    title: string;
    tenant_ids: string[];
    description: string;
  }