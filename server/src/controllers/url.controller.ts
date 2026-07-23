import { Request, Response } from "express";
import { nanoid } from "nanoid";

import Url from "../models/URL";
import { verifyToken } from "../utils/verifyToken";

type UrlClickEvent = {
  id: string;
  shortCode: string;
  clicks: number;
};

const clickEventClients = new Map<string, Set<Response>>();

const addClickEventClient = (userId: string, res: Response) => {
  const clients = clickEventClients.get(userId) ?? new Set<Response>();
  clients.add(res);
  clickEventClients.set(userId, clients);
};

const removeClickEventClient = (userId: string, res: Response) => {
  const clients = clickEventClients.get(userId);

  if (!clients) return;

  clients.delete(res);

  if (clients.size === 0) {
    clickEventClients.delete(userId);
  }
};

const notifyUrlClick = (userId: string, payload: UrlClickEvent) => {
  const clients = clickEventClients.get(userId);

  if (!clients) return;

  const event = `event: url-click\ndata: ${JSON.stringify(payload)}\n\n`;

  clients.forEach((client) => {
    client.write(event);
  });
};

const isValidUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

const createUniqueShortUrl = async (originalUrl: string, userId: string) => {
  const maxAttempts = 5;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shortCode = nanoid(6);

    try {
      return await Url.create({
        originalUrl,
        shortCode,
        user : userId
      });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000 &&
        attempt < maxAttempts - 1
      ) {
        continue;
      }

      throw error;
    }
  }

  throw new Error("Unable to generate unique short code");
};

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

    if (!isValidUrl(originalUrl)) {
      res.status(400).json({
        success: false,
        message: "A valid http or https URL is required",
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

    const newUrl = await createUniqueShortUrl(originalUrl, userId);

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

    notifyUrlClick(String(url.user), {
      id: String(url._id),
      shortCode: url.shortCode,
      clicks: url.clicks,
    });

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const subscribeToUrlClicks = (
  req: Request,
  res: Response
): void => {
  const token = typeof req.query.token === "string" ? req.query.token : "";

  if (!token) {
    res.status(401).json({
      message: "No token provided",
    });
    return;
  }

  try {
    const decoded = verifyToken(token);
    const userId = decoded.id;

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });

    res.write(`event: connected\ndata: ${JSON.stringify({ success: true })}\n\n`);
    addClickEventClient(userId, res);

    const keepAlive = setInterval(() => {
      res.write(": keep-alive\n\n");
    }, 30000);

    req.on("close", () => {
      clearInterval(keepAlive);
      removeClickEventClient(userId, res);
      res.end();
    });
  } catch {
    res.status(401).json({
      message: "Invalid Token",
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
      success:true,
      data: urls.map((url)=>({
          id: url._id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
          clicks: url.clicks,
          createdAt: url.createdAt
      }))
    });
  }catch(error){
    res.status(500).json({
      success : false,
      message : "Internal Server Error"
    })
    return;
  }
}
