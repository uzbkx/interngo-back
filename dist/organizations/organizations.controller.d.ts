import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
export declare class OrganizationsController {
    private orgsService;
    constructor(orgsService: OrganizationsService);
    getMyOrg(userId: string): Promise<{
        organization: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/organization.schema").Organization, {}, {}> & import("./schemas/organization.schema").Organization & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/organization.schema").Organization, {}, {}> & import("./schemas/organization.schema").Organization & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>) | null;
    }>;
    create(userId: string, dto: CreateOrganizationDto): Promise<{
        organization: import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/organization.schema").Organization, {}, {}> & import("./schemas/organization.schema").Organization & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/organization.schema").Organization, {}, {}> & import("./schemas/organization.schema").Organization & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>;
    }>;
    update(userId: string, dto: Partial<CreateOrganizationDto>): Promise<{
        organization: (import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/organization.schema").Organization, {}, {}> & import("./schemas/organization.schema").Organization & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/organization.schema").Organization, {}, {}> & import("./schemas/organization.schema").Organization & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        } & Required<{
            _id: import("mongoose").Types.ObjectId;
        }>) | null;
    }>;
}
