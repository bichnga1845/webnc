import { IFakeProductRating } from "./irating";

export interface IFakeProduct{
    id:number,
    title:string,
    price:number,
    description:string,
    category:string,
    image:string ,
    rate:IFakeProductRating

}