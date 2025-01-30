import { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import { Input, Button, Form, Select, message, Checkbox } from 'antd';


const { Option } = Select;

interface Post {
    id: number;
    title: string;
    content: string;
    status: string;
    created_at?: string;
}

interface FormValues {
    title: string;
    content: string;
    status: string;
    triggerWebhook: boolean;
}

const CmsDashboard = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const { data, error } = await supabase.from('blog_posts').select('*');
        if (error) {
            message.error('Error fetching posts');
        } else {
            setPosts(data);
        }
    };

    const handleSubmit = async (values: FormValues) => {
        setLoading(true);
        const { error } = editingPost
            ? await supabase.from('blog_posts').update(values).eq('id', editingPost.id)
            : await supabase.from('blog_posts').insert([{ ...values, created_at: new Date() }]);

        if (error) {
            message.error('Error saving post');
        } else {
            message.success('Post saved successfully');

            // Trigger Netlify build when publishing
            if (values.status === 'published' && values.triggerWebhook) {
                try {
                    const response = await fetch('/.netlify/functions/triggerWebhook', {
                        method: 'POST',
                        body: JSON.stringify({ status: values.status }),
                    });
                    const result = await response.json();
                    if (response.ok) {
                        message.success(result.message);
                    } else {
                        message.error(result.error);
                    }
                } catch (error) {
                    message.error('Failed to trigger Netlify build');
                }
            }
        }

        setLoading(false);
        form.resetFields();
        setEditingPost(null);
        fetchPosts();
    };

    const handleEdit = (post: Post) => {
        setEditingPost(post);
        form.setFieldsValue(post);
    };

    const handleDelete = async (id: number) => {
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) {
            message.error('Error deleting post');
        } else {
            message.success('Post deleted');
            fetchPosts();
        }
    };



    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">CMS Dashboard</h2>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please enter a title' }]}>
                    <Input placeholder="Enter post title" />
                </Form.Item>
                <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Please enter content' }]}>
                    <Input.TextArea
                        className="h-40"
                        onChange={(e) => form.setFieldsValue({ content: e.target.value })}
                    />
                </Form.Item>
                <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                    <Select>
                        <Option value="draft">Draft</Option>
                        <Option value="published">Published</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="triggerWebhook" valuePropName="checked">
                    <Checkbox>Trigger Netlify build on publish</Checkbox>
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {editingPost ? 'Update Post' : 'Add Post'}
                </Button>
            </Form>

            <h3 className="text-xl font-semibold mt-6">Existing Posts</h3>
            <ul className="mt-4">
                {posts.map((post) => (
                    <li key={post.id} className="p-4 border rounded-md flex justify-between items-center">
                        <span className="font-medium">{post.title}</span>
                        <div>
                            <Button onClick={() => handleEdit(post)} className="mr-2">Edit</Button>
                            <Button danger onClick={() => handleDelete(post.id)}>Delete</Button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CmsDashboard;