import { Request, Response } from "express";
import { nanoid } from "nanoid";

import Url from "../models/URL";

export const shortenUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { originalUrl } = req.body;
    if (!userId) {
      res.status(401).json({
          success: false,
          message: "Unauthorized"
      });
      return;
    }
    if (!originalUrl) {
      res.status(400).json({
        success: false,
        message: "Original URL is required",
      });
      return;
    }

    const existingUrl = await Url.findOne({ originalUrl, user : userId });

    if (existingUrl) {
      res.status(200).json({
        success: true,
        data: {
          id: existingUrl._id,
          originalUrl: existingUrl.originalUrl,
          shortCode: existingUrl.shortCode,
          shortUrl: `${process.env.BASE_URL}/${existingUrl.shortCode}`,
          clicks: existingUrl.clicks,
          createdAt: existingUrl.createdAt,
        },
      });
      return;
    }

    const shortCode = nanoid(6);

    const newUrl = await Url.create({
      originalUrl,
      shortCode,
      user : userId
    });

    res.status(201).json({
      success: true,
      data: {
        id: newUrl._id,
        originalUrl: newUrl.originalUrl,
        shortCode: newUrl.shortCode,
        shortUrl: `${process.env.BASE_URL}/${newUrl.shortCode}`,
        clicks: newUrl.clicks,
        createdAt: newUrl.createdAt,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const redirectUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { code } = req.params;

    const url = await Url.findOne({ shortCode: code });

    if (!url) {
      res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
      return;
    }

    url.clicks++;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getMyUrls = async (
  req : Request,
  res : Response
) : Promise<void> => {
  try{
    const userId = req.user?.id;
    if(!userId){
      res.status(401).json({
        message : "Unauthorized"
      });
      return;
    }

    const urls = await Url.find({
      user : userId
    }).sort({
      createdAt : -1
    });

    res.status(200).json({
      success : true,
      data : urls
    });
  }catch(error){
    res.status(500).json({
      success : false,
      message : "Internal Server Error"
    })
    return;
  }
}