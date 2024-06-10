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

  export interface ArmyStaff {
    id: string;
    date_created: string;
    date_updated: string;
    fullname: string;
    title: string;
    image: string;
    description: string;
    files: any[]; // Specify the type of files if known, e.g., string[] or File[]
    appointment_start_date: string | null;
    appointment_end_date: string | null;
    current: boolean;
}

export interface IPressRelease {
    id: string;
    date_created: string;
    date_updated: string;
    tenant_id: string;
    title: string;
    image: string;
    date: string,
    files: string[];
    description: string;
}

export interface ILiveEvent {
    id: string;
    title:string;
    image:string;
    event_link: string;
    date: string;
    start_time: string;
    end_time: string;
    theme_title: string;
    theme_description: string;
}

export interface ISuggestions  {
    id: string;
    date_created: string;
    date_updated: string;
    user_id: string | null;
    description:string;
}
