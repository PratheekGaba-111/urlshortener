import mongoose, {Document, Schema} from "mongoose";
import bcrypt from "bcrypt";


export interface IUser extends Document {
    name : string;
    email : string;
    password : string;
    comparePassword(candidatePassword : string) : Promise<boolean>;
}


const UserSchema = new Schema(
    {
        name : {
            type : String, 
            required : true,
            trim : true
        },
        email : {
            type : String,
            required : true,
            trim : true,
            unique : true,
            lowercase : true
        },
        password : {
            type : String,
            minLength : 6,
            required : true,
            select : false
        }
    },
    {
        timestamps : true
    }
);



UserSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


UserSchema.methods.comparePassword = async function (candidatePassword : string) : Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
