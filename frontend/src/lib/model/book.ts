export type Book = {
    name : string
    author : string
    credits : number
    description : string
    condition : Condition
    general : string
    reating : number
    photo : string
    category : Cateogry
}


export enum Cateogry {
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