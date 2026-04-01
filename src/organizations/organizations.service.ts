import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Organization, OrganizationDocument } from './schemas/organization.schema';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization.name) private orgModel: Model<OrganizationDocument>,
  ) {}

  async findByOwner(ownerId: string) {
    return this.orgModel.findOne({ ownerId: new Types.ObjectId(ownerId) });
  }

  async findById(id: string) {
    return this.orgModel.findById(id);
  }

  async create(ownerId: string, dto: CreateOrganizationDto) {
    // Check if user already has an org
    const existing = await this.orgModel.findOne({ ownerId: new Types.ObjectId(ownerId) });
    if (existing) {
      throw new ConflictException('You already have an organization');
    }

    const slug = this.slugify(dto.name);
    const slugExists = await this.orgModel.findOne({ slug });
    const finalSlug = slugExists ? `${slug}-${Date.now().toString(36)}` : slug;

    return this.orgModel.create({
      ...dto,
      slug: finalSlug,
      ownerId: new Types.ObjectId(ownerId),
    });
  }

  async update(ownerId: string, dto: Partial<CreateOrganizationDto>) {
    const org = await this.orgModel.findOne({ ownerId: new Types.ObjectId(ownerId) });
    if (!org) return null;
    Object.assign(org, dto);
    return org.save();
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}
