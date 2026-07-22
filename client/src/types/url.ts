export interface UrlResponse{
    success : boolean,
    data : UrlData
};
export interface UrlRequest{
    originalUrl : string
};
export interface UrlData {
    id: string;
    originalUrl: string;
    shortCode: string;
    shortUrl: string;
    clicks: number;
    createdAt: string;
}
