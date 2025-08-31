import mongoose from "mongoose";
declare const OtpModel: mongoose.Model<{
    email: string;
    otp: string;
    expiresAt: NativeDate;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    email: string;
    otp: string;
    expiresAt: NativeDate;
}, {}, mongoose.DefaultSchemaOptions> & {
    email: string;
    otp: string;
    expiresAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    email: string;
    otp: string;
    expiresAt: NativeDate;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    email: string;
    otp: string;
    expiresAt: NativeDate;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    email: string;
    otp: string;
    expiresAt: NativeDate;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default OtpModel;
//# sourceMappingURL=Otp.d.ts.map