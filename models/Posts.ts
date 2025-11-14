
import mongoose, { Schema, model, Document } from 'mongoose';


export interface IPost extends Document {
  type: 'LOST' | 'FOUND';
  title: string;
  description: string;
  phone: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
  };
  images: string[];
  comments: string[];
  reaction: {
    loves: string[];
  };
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const PostSchema = new Schema<IPost>(
  {
    type: {
      type: String,
      enum: ['LOST', 'FOUND'],
      required: [true, 'Постын төрөл (LOST эсвэл FOUND) заавал оруулна уу'],
    },
    title: {
      type: String,
      required: [true, 'Гарчиг оруулна уу (жишээ: iPhone 13 алга боллоо)'],
      maxLength: [100, 'Гарчиг 100 тэмдэгтээс хэтрэхгүй байх ёстой'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Тайлбар оруулна уу (хаана, хэзээ, ямар онцлогтой вэ?)'],
      maxLength: [1000, 'Тайлбар 1000 тэмдэгтээс хэтрэхгүй'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Холбоо барих утасны дугаар оруулна уу'],
      match: [/^\+?[0-9\s\-\(\)]+$/, 'Зөв утасны дугаар оруулна уу'],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: [true, 'Байршил (longitude, latitude) оруулна уу'],
        validate: {
          validator: (v: number[]) => v.length === 2,
          message: 'Coordinates must be [longitude, latitude]',
        },
      },
      address: {
        type: String,
        default: '',
        trim: true,
      },
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr: string[]) => arr.length <= 5,
        message: 'Хамгийн их 5 зураг оруулж болно',
      },
    },
    comments: {
      type: [String],
      default: [],
    },
    reaction: {
      loves: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: [],
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Хэрэглэгчийн ID оруулна уу'],
      index: true,
    },
  },
  {
    timestamps: true,
  }
);


PostSchema.index({ location: '2dsphere' });
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ type: 1, createdAt: -1 });

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;