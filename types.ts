export interface AffiliateProduct {
  name: string;
  url: string;
}

export interface ArticleParams {
  topic: string;
  location: string;
  tone: string;
  style: string;
  keyword: string;
  visualStyle: string;
  textColor: string;
  backgroundColor: string;
  products: AffiliateProduct[];
}

export interface GeneratedContent {
  title: string;
  htmlBody: string;
}

export enum GenerationStatus {
  IDLE = 'idle',
  GENERATING = 'generating',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}