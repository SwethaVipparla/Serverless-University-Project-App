export interface Jwks {
    kty: string;
    use: string;
    kid: string;
    x5c: string;
    nbf?: string;
}