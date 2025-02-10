export interface CustomField {
    name: string;
    type: 'text' | 'image' | 'header' | 'color';
    value?: string;
    alt?: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    content_html?: string;
    status: 'draft' | 'published';
    template: 'basic' | 'minimal' | 'modern';
    created_at?: string;
    scheduled_publish_date?: string;
    featured_image?: string;
    slug: string;
    customFields?: CustomField[];
}