import type { IconName } from "@fortawesome/free-solid-svg-icons";

export interface User {
    _id: string;
    username: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    sports?: Sport[];
    bio?: string;
    birthdate?: Date;
    gender?: 'Male' | 'Female' | 'Other';
    profilePicture?: string;
    role?: 'user' | 'admin';
}

export interface UserProfile {
    _id: string;
    username: string;
    city?: string;
    sports?: Sport[];
    bio?: string;
    age?: number;
    profilePicture?: string;
}

export interface Sport {
    _id: string;
    name: string;
    icon?: IconName;
}

export interface Event {
    _id: string;
    user: User;
    title: string;
    sport: Sport;
    location: string;
    date: Date;
    description?: string;
    max: number;
    attendees?: { _id: string, user: User, joinedAt: Date }[];
    medias?: string[];
    createdAt?: Date;
}

export interface Message {
    _id: string;
    sender: User;
    text: string;
    readBy: User[];
    medias?: string[];
    createdAt: string;
}

export interface Conversation {
    _id: string;
    type: 'private' | 'group';
    members: User[];
    title?: string;
    groupAdmin?: User;
    lastMessage?: Message;
    updatedAt: string;
}