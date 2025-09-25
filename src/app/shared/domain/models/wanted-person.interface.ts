// Interfaces para los datos de la API del FBI
export interface WantedImage {
  original: string;
  thumb?: string;
  large?: string;
  caption?: string;
}

export interface WantedPerson {
  uid: string;
  title: string;
  description?: string;
  publication: string;
  images?: WantedImage[];
  status?: string;
  sex?: string;
  warning_message?: string;
  details?: string;
  url?: string;
  poster_classification?: string;
}

export interface FBIApiResponse {
  items: WantedPerson[];
  total: number;
  page: number;
}