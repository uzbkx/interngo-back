import { ContactDto } from './dto/contact.dto';
export declare class ContactController {
    submit(dto: ContactDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
