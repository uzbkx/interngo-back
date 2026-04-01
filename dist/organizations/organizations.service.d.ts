import { Model, Types } from 'mongoose';
import { Organization, OrganizationDocument } from './schemas/organization.schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';
export declare class OrganizationsService {
    private orgModel;
    constructor(orgModel: Model<OrganizationDocument>);
    findByOwner(ownerId: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Organization, {}, {}> & Organization & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Organization, {}, {}> & Organization & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    findById(id: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Organization, {}, {}> & Organization & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Organization, {}, {}> & Organization & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    create(ownerId: string, dto: CreateOrganizationDto): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Organization, {}, {}> & Organization & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Organization, {}, {}> & Organization & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    update(ownerId: string, dto: Partial<CreateOrganizationDto>): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Organization, {}, {}> & Organization & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Organization, {}, {}> & Organization & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    private slugify;
}
