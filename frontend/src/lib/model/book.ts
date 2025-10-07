export type Book = {
    image : string
    name : string
    author : string
    credits : number
    description : string
    condition : Condition
    general : string
    rating : number
    category : Category
    reviewer : string
    status : boolean
}


export enum Category {
    Other,
    Fiction,
    NonFiction,
    TextBook, Biography, Science, History, Romance, Mystery,
    Fantasy, Selfhelp, Business, Art, Cooking, Travel,
    Children, Young, Adult, Phylosophy, Religion, Health, Eductaion
}

export enum Condition {
    LikeNew, VeryGood, Good, Fair, Poor
}