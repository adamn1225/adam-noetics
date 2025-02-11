export const DraggableItemType = 'ITEM';

export interface DraggableItem {
    id: string;
    type: typeof DraggableItemType;
    content: string;
}

export interface CustomField {
    name: string;
    type: string;
    value: string;
    padding?: string;
    margin?: string;
    textAlign?: string;
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

export interface FormValues {
    title: string;
    content: string;
    content_html?: string;
    status: 'draft' | 'published';
    template: 'basic' | 'minimal' | 'modern';
    scheduled_publish_date?: string;
    featured_image?: string;
    slug: string;
    customFields?: CustomField[];
}