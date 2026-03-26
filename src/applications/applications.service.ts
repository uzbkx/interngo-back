import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name) private applicationModel: Model<ApplicationDocument>,
  ) {}

  async findByUser(userId: string) {
    return this.applicationModel
      .find({ userId: new Types.ObjectId(userId) })
      .populate('listingId')
      .sort({ updatedAt: -1 });
  }

  async upsert(userId: string, dto: CreateApplicationDto) {
    const filter = {
      userId: new Types.ObjectId(userId),
      listingId: new Types.ObjectId(dto.listingId),
    };

    const update = {
      ...filter,
      ...(dto.status && { status: dto.status }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
    };

    return this.applicationModel.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
    }).populate('listingId');
  }

  async update(id: string, userId: string, dto: UpdateApplicationDto) {
    const app = await this.applicationModel.findById(id);
    if (!app) throw new NotFoundException('Application not found');
    if (app.userId.toString() !== userId) throw new ForbiddenException();

    Object.assign(app, dto);
    await app.save();
    return app.populate('listingId');
  }

  async remove(id: string, userId: string) {
    const app = await this.applicationModel.findById(id);
    if (!app) throw new NotFoundException('Application not found');
    if (app.userId.toString() !== userId) throw new ForbiddenException();

    await app.deleteOne();
    return { deleted: true };
  }
}
