import {Request, Response} from "express";
import {nanoid} from "nanoid";

import Url from "../models/URL";

export const shortenUrl = async(
    req : Request, 
    res : Response
) : Promise<void> => {
    try{
        const {originalUrl} = req.body;
        if(!originalUrl){
            res.send(400).json({
                success : false,
                message : "Original URL is required"
            });
            return;
        }
        
        const existingUrl = await Url.findOne({originalUrl});
        if(existingUrl){
            res.send(200).json({
                success : true,
                shortenUrl : `http://localhost:5000/${existingUrl.shortCode}`,
            });
            return;
        }
        const shortCode = nanoid(6);
        const newUrl = await Url.create({
            originalUrl, 
            shortCode
        });
        res.send(201).json({
                success : true,
                shortenUrl : `http://localhost:5000/${newUrl.shortCode}`,
            });
    }catch(error){
        res.send(500).json({
            success : false,
            message : "Internal Server Error"
        })
    }
};

export const redirectUrl = async(
    req : Request,
    res : Response
) : Promise<void> => {
    try{
        console.log("Redirect route hit");
        const {code} = req.params;
        const url = await Url.findOne({shortCode : code});
        
        if(!url){
            res.send(404).json({
                success : false,
                message : "Short URL not found"
            });
            return;
        }
        url.clicks++;
        await url.save();

        res.redirect(url.originalUrl);
    }catch(error){
        res.send(500).json({
            success : false,
            message : "Internal Server Error"
        });
    }
};

