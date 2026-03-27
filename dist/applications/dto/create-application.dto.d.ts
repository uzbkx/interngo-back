import { ApplicationStatus } from '../schemas/application.schema';
export declare class CreateApplicationDto {
    listingId: string;
    status?: ApplicationStatus;
    notes?: string;
}
