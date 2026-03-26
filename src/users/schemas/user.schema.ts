import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  STUDENT = 'STUDENT',
  ORGANIZATION = 'ORGANIZATION',
  ADMIN = 'ADMIN',
}

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop()
  name: string;

  @Prop()
  avatarUrl: string;

  @Prop()
  bio: string;

  @Prop({ enum: Role, default: Role.STUDENT })
  role: Role;

  @Prop({ select: false })
  refreshToken: string;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
