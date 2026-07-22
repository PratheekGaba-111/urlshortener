import {Schema, model, InferSchemaType} from "mongoose";
const urlSchema = new Schema(
    {
        originalUrl : {
            type : String, 
            required : true,
            trim : true
        },
        shortCode : {
            type : String,
            required : true, 
            unique : true,
            index : true
        },
        clicks : {
            type : Number,
            default : 0
        }
    },
    {
        timestamps : true
    }
);

export type Url = InferSchemaType<typeof urlSchema>;

export default model<Url>("Url", urlSchema);

