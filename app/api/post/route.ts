
import { NextRequest, NextResponse } from 'next/server';
import Post from '@/models/Posts';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongo';

const getUserFromCookie = async (req: NextRequest) => {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);
    return user ? decoded.id : null;
  } catch (error) {
    return null;
  }
};

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const userId = await getUserFromCookie(req);
    if (!userId) {
      return NextResponse.json({ error: 'Нэвтрээгүй байна' }, { status: 401 });
    }

    const body = await req.json();
    const { type, title, description, phone, lat, lng, address = '', images = [] } = body;

    if (!type || !['LOST', 'FOUND'].includes(type)) {
      return NextResponse.json({ error: 'Төрөл (LOST эсвэл FOUND) заавал' }, { status: 400 });
    }
    if (!title || title.trim().length < 5) {
      return NextResponse.json({ error: 'Гарчиг хамгийн багадаа 5 тэмдэгт' }, { status: 400 });
    }
    if (!description || description.trim().length < 10) {
      return NextResponse.json({ error: 'Тайлбар хамгийн багадаа 10 тэмдэгт' }, { status: 400 });
    }
    if (!phone || !/^\+?[0-9\s\-\(\)]+$/.test(phone)) {
      return NextResponse.json({ error: 'Зөв утасны дугаар оруулна уу' }, { status: 400 });
    }
    if (!lat || !lng) {
      return NextResponse.json({ error: 'Байршил (lat, lng) заавал' }, { status: 400 });
    }

    const newPost = new Post({
      type,
      title: title.trim(),
      description: description.trim(),
      phone,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
        address,
      },
      images,
      userId,
    });

    await newPost.save();
    await User.findByIdAndUpdate(userId, { $push: { posts: newPost._id } });

    return NextResponse.json(
      {
        message: 'Пост амжилттай үүслээ!',
        post: {
          id: newPost._id,
          type: newPost.type,
          title: newPost.title,
          createdAt: newPost.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create Post Error:', error);
    return NextResponse.json(
      { error: 'Серверт алдаа гарлаа', details: error.message },
      { status: 500 }
    );
  }
}