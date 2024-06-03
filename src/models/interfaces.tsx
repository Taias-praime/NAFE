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
<<<<<<< HEAD
    start_date: string;
    end_date: string;
    event_link: string;
}
=======
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
>>>>>>> 7fb6ec9059ff27dcec43d3f5ac338da0b2ad625a
