
export interface ProductItem {
  id: number;
  title: string;
  description: string;
  image: string;
  url: string;
  cta_text: string;
  site_name: string;
  type: string;
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
  // Affiliate Widget State
  productWidgetHtml: string;
  productWidgetItems: ProductItem[];
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
