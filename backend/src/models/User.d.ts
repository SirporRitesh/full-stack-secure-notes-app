import mongoose from "mongoose";
export declare const User: mongoose.Model<{
    email: string;
    provider: string;
    createdAt: NativeDate;
    name?: string | null;
    picture?: string | null;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    email: string;
    provider: string;
    createdAt: NativeDate;
    name?: string | null;
    picture?: string | null;
}, {}, mongoose.DefaultSchemaOptions> & {
    email: string;
    provider: string;
    createdAt: NativeDate;
    name?: string | null;
    picture?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    email: string;
    provider: string;
    createdAt: NativeDate;
    name?: string | null;
    picture?: string | null;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    email: string;
    provider: string;
    createdAt: NativeDate;
    name?: string | null;
    picture?: string | null;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    email: string;
    provider: string;
    createdAt: NativeDate;
    name?: string | null;
    picture?: string | null;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=User.d.ts.map