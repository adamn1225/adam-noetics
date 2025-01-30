import React, { useState, useEffect } from "react";
import { Calendar, Badge, Modal, Form, Input, DatePicker, Select, Button, Card, List, Switch } from "antd";
import { motion } from "framer-motion";
import DashboardLayout from "../UserLayout";
import { supabase } from "@lib/supabaseClient";
import dayjs from "dayjs";
import AddAccessToken from "@components/AddAccessToken";

const { TextArea } = Input;
const { Option } = Select;

const SmCalendar = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEventDetailsModalVisible, setIsEventDetailsModalVisible] = useState(false);
    const [isAccessTokenModalVisible, setIsAccessTokenModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [form] = Form.useForm();
    const [eventForm] = Form.useForm();

    useEffect(() => {
        const fetchEvents = async () => {
            const { data, error } = await supabase.from("smm_calendar").select("*");
            if (error) {
                console.error("Error fetching events:", error);
            } else {
                setEvents(data);
            }
        };
        fetchEvents();
    }, []);

    interface Event {
        id: number;
        title: string;
        description: string;
        post_due_date: string;
        sm_platform: string;
        status: string;
        post_automatically: boolean;
        user_id: string;
    }

    const cellRender = (current: dayjs.Dayjs, info: { type: string }) => {
        if (info.type === 'date') {
            const listData = events.filter((event: Event) =>
                dayjs(event.post_due_date).isSame(current, "day")
            );
            return (
                <ul className="events">
                    {listData.map((item: Event) => (
                        <li key={item.id} onClick={() => handleEventClick(item)}>
                            <Badge status={item.status === "Published" ? "success" : "warning"} text={item.title} />
                        </li>
                    ))}
                </ul>
            );
        }
        return <div>{current.date()}</div>;
    };

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setIsEventDetailsModalVisible(true);
        eventForm.setFieldsValue({
            title: event.title,
            description: event.description,
            post_due_date: dayjs(event.post_due_date),
            sm_platform: event.sm_platform,
            status: event.status,
            post_automatically: event.post_automatically,
        });
    };

    const postToSocialMedia = async (event: Event) => {
        try {
            const response = await fetch('/.netlify/functions/postToSocialMedia', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ event }),
            });

            if (!response.ok) {
                throw new Error(`Failed to post on ${event.sm_platform}`);
            }

            console.log(`Post successfully published on ${event.sm_platform}`);
        } catch (error) {
            console.error("Error posting:", error);
        }
    };

    const handleAddEvent = async (values: any) => {
        const { title, description, post_due_date, sm_platform, status, post_automatically } = values;
        const user_id = "current-user-id"; // Replace with actual user ID
        const { data, error } = await supabase.from("smm_calendar").insert([
            { title, description, post_due_date, sm_platform, status, post_automatically, user_id },
        ]);

        if (error) {
            console.error("Error adding event:", error);
        } else {
            if (data) {
                setEvents([...events, ...data]);
                if (post_automatically) {
                    postToSocialMedia(data[0]);
                }
            }
            setIsModalVisible(false);
            form.resetFields();
        }
    };

    const handleUpdateEvent = async (values: any) => {
        const { title, description, post_due_date, sm_platform, status, post_automatically } = values;
        const user_id = "current-user-id"; // Replace with actual user ID
        const { data, error } = await supabase
            .from("smm_calendar")
            .update({ title, description, post_due_date, sm_platform, status, post_automatically, user_id })
            .eq("id", selectedEvent.id);

        if (error) {
            console.error("Error updating event:", error);
        } else {
            setEvents(events.map((event) => (event.id === selectedEvent.id ? { ...event, ...values } : event)));
            setIsEventDetailsModalVisible(false);
            setSelectedEvent(null);
            eventForm.resetFields();
        }
    };

    const handleDeleteEvent = async () => {
        const { error } = await supabase.from("smm_calendar").delete().eq("id", selectedEvent.id);

        if (error) {
            console.error("Error deleting event:", error);
        } else {
            setEvents(events.filter((event) => event.id !== selectedEvent.id));
            setIsEventDetailsModalVisible(false);
            setSelectedEvent(null);
        }
    };

    const callScheduledPostFunction = async () => {
        if (process.env.NODE_ENV === 'development') {
            try {
                const response = await fetch('/.netlify/functions/scheduledPost');
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to call scheduled post function: ${errorText}`);
                }
                console.log('Scheduled post function called successfully');
            } catch (error) {
                console.error('Error calling scheduled post function:', error);
            }
        }
    };

    useEffect(() => {
        callScheduledPostFunction();
    }, []);

    const upcomingEvents = events
        .filter((event) => dayjs(event.post_due_date).isAfter(dayjs()))
        .sort((a, b) => dayjs(a.post_due_date).diff(dayjs(b.post_due_date)))
        .slice(0, 5);

    return (
        <DashboardLayout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 py-4"
            >
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/6">

                        <Card title="Upcoming Posts" bordered={false}>
                            <List
                                itemLayout="horizontal"
                                dataSource={upcomingEvents}
                                renderItem={(event) => (
                                    <List.Item
                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                                        onClick={() => handleEventClick(event)}
                                    >
                                        <List.Item.Meta
                                            title={<span className="font-semibold text-nowrap">{event.title}</span>}
                                            description={`${dayjs(event.post_due_date).format("MMMM D, YYYY")} • ${event.sm_platform
                                                }`}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                        <div className="bg-white px-2 py-4 shadow-md mt-3 flex flex-col items-start justify-start gap-2 rounded-md">
                            <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-white">
                                Connect to Your Social Media Platforms
                            </h2>
                            <button
                                className="text-base bg-blue-950 mv-2 self-center w-full text-white font-semibold px-3 py-1 shadow-md rounded-md"
                                onClick={() => setIsAccessTokenModalVisible(true)}
                            >
                                Add Access Token
                            </button>
                        </div>

                    </div>
                    {/* Calendar Section */}
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold text-center my-4 text-gray-800 dark:text-white">
                            Social Media Calendar
                        </h2>
                        <div className="flex items-center justify-start mb-2 w-full">
                            <button
                                className="text-lg bg-blue-950 text-white px-3 py-1 shadow-md rounded-md"
                                onClick={() => setIsModalVisible(true)}
                            >
                                Add SMM Event
                            </button>

                        </div>


                        <div className="p-1 bg-white text-nowrap rounded-lg shadow-md">
                            <Calendar
                                cellRender={cellRender}
                                style={{ maxWidth: "100%", maxHeight: "100%" }}
                                className="custom-calendar"
                            />
                        </div>
                    </div>


                </div>

                {/* Modals (Add Event, Edit Event & Add Access Token) */}
                <Modal title="Add Event" visible={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
                    <Form form={form} onFinish={handleAddEvent} layout="vertical">
                        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please enter the title" }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Description">
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item name="post_due_date" label="Post Due Date" rules={[{ required: true }]}>
                            <DatePicker showTime />
                        </Form.Item>
                        <Form.Item name="sm_platform" label="Social Media Platform" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Facebook">Facebook</Option>
                                <Option value="Twitter">Twitter</Option>
                                <Option value="Instagram">Instagram</Option>
                                <Option value="LinkedIn">LinkedIn</Option>
                                <Option value="TikTok">TikTok</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="post_automatically" label="Auto Post?" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Add Event
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="Event Details"
                    visible={isEventDetailsModalVisible}
                    onCancel={() => setIsEventDetailsModalVisible(false)}
                    footer={null}
                >
                    <Form form={eventForm} onFinish={handleUpdateEvent} layout="vertical">
                        <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please enter the title" }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="Description">
                            <TextArea rows={4} />
                        </Form.Item>
                        <Form.Item name="post_due_date" label="Post Due Date" rules={[{ required: true }]}>
                            <DatePicker showTime />
                        </Form.Item>
                        <Form.Item name="sm_platform" label="Social Media Platform" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Facebook">Facebook</Option>
                                <Option value="Twitter">Twitter</Option>
                                <Option value="Instagram">Instagram</Option>
                                <Option value="LinkedIn">LinkedIn</Option>
                                <Option value="TikTok">TikTok</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                            <Select>
                                <Option value="Draft">Draft</Option>
                                <Option value="Scheduled">Scheduled</Option>
                                <Option value="Published">Published</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="post_automatically" label="Auto Post?" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Update Event
                            </Button>
                            <Button danger={true} onClick={handleDeleteEvent} style={{ marginLeft: "10px" }}>
                                Delete Event
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="Add Access Token"
                    visible={isAccessTokenModalVisible}
                    onCancel={() => setIsAccessTokenModalVisible(false)}
                    footer={null}
                >
                    <AddAccessToken />
                </Modal>
            </motion.div>
            <style jsx>{`
                .custom-calendar .ant-picker-cell-inner {
                    min-width: 120px; /* Adjust the width as needed */
                    white-space: nowrap;
                }
            `}</style>
        </DashboardLayout>
    );
};

export default SmCalendar;