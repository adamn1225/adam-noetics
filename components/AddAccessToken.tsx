import React, { useState } from "react";
import { Form, Input, Select, Button, message } from "antd";
import { supabase } from "@lib/supabaseClient";

const { Option } = Select;

const AddAccessToken = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleAddToken = async (values: any) => {
        setLoading(true);
        const { platform, access_token } = values;
        const user_id = "current-user-id"; // Replace with actual user ID

        const { data, error } = await supabase.from("user_tokens").insert([
            { user_id, platform, access_token },
        ]);

        setLoading(false);

        if (error) {
            message.error("Error adding access token");
            console.error("Error adding access token:", error);
        } else {
            message.success("Access token added successfully");
            form.resetFields();
        }
    };

    return (
        <Form form={form} onFinish={handleAddToken} layout="vertical">
            <Form.Item name="platform" label="Social Media Platform" rules={[{ required: true }]}>
                <Select>
                    <Option value="Facebook">Facebook</Option>
                    <Option value="Twitter">Twitter</Option>
                    <Option value="Instagram">Instagram</Option>
                    <Option value="LinkedIn">LinkedIn</Option>
                    <Option value="TikTok">TikTok</Option>
                </Select>
            </Form.Item>
            <Form.Item name="access_token" label="Access Token" rules={[{ required: true, message: "Please enter the access token" }]}>
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Add Access Token
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddAccessToken;