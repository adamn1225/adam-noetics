import { useState, useEffect } from 'react';
import { supabase } from '@lib/supabaseClient';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import AddAccessToken from '@components/AddAccessToken';

const SMMCalendar = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEventDetailsModalVisible, setIsEventDetailsModalVisible] = useState(false);
    const [isAccessTokenModalVisible, setIsAccessTokenModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [formValues, setFormValues] = useState({
        title: '',
        description: '',
        post_due_date: '',
        sm_platform: 'Facebook',
        status: 'Draft',
        post_automatically: false,
    });

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

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setIsEventDetailsModalVisible(true);
        setFormValues({
            title: event.title,
            description: event.description,
            post_due_date: event.post_due_date,
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

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const { title, description, post_due_date, sm_platform, status, post_automatically } = formValues;
        const { data, error } = await supabase.from("smm_calendar").insert([
            { title, description, post_due_date, sm_platform, status, post_automatically, user_id: selectedEvent?.user_id },
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
            setFormValues({
                title: '',
                description: '',
                post_due_date: '',
                sm_platform: 'Facebook',
                status: 'Draft',
                post_automatically: false,
            });
        }
    };

    const handleUpdateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const { title, description, post_due_date, sm_platform, status, post_automatically } = formValues;
        const { data, error } = await supabase
            .from("smm_calendar")
            .update({ title, description, post_due_date, sm_platform, status, post_automatically, user_id: selectedEvent.user_id })
            .eq("id", selectedEvent.id);

        if (error) {
            console.error("Error updating event:", error);
        } else {
            setEvents(events.map((event) => (event.id === selectedEvent.id ? { ...event, ...formValues } : event)));
            setIsEventDetailsModalVisible(false);
            setSelectedEvent(null);
            setFormValues({
                title: '',
                description: '',
                post_due_date: '',
                sm_platform: 'Facebook',
                status: 'Draft',
                post_automatically: false,
            });
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
        if (process.env.NODE_ENV !== 'production') {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        const checked = (e.target as HTMLInputElement).checked;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 py-4"
            >
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="lg:w-1/6">
                        <div className="bg-white px-4 py-4 shadow-md rounded-md">
                            <h2 className="text-xl font-semibold mb-4">Upcoming Posts</h2>
                            <ul className="space-y-2">
                                {upcomingEvents.map((event) => (
                                    <li
                                        key={event.id}
                                        className="cursor-pointer hover:bg-gray-100 p-2 rounded-md"
                                        onClick={() => handleEventClick(event)}
                                    >
                                        <div className="font-semibold">{event.title}</div>
                                        <div className="text-sm text-gray-500">
                                            {dayjs(event.post_due_date).format("MMMM D, YYYY")} • {event.sm_platform}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white px-4 py-4 shadow-md mt-3 flex flex-col items-start justify-start gap-2 rounded-md">
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
                                onClickDay={(value) => {
                                    const eventsOnDay = events.filter((event) =>
                                        dayjs(event.post_due_date).isSame(value, 'day')
                                    );
                                    if (eventsOnDay.length > 0) {
                                        handleEventClick(eventsOnDay[0]);
                                    }
                                }}
                                tileContent={({ date, view }) => {
                                    if (view === 'month') {
                                        const eventsOnDay = events.filter((event) =>
                                            dayjs(event.post_due_date).isSame(date, 'day')
                                        );
                                        return (
                                            <ul className="events">
                                                {eventsOnDay.map((item) => (
                                                    <li key={item.id}>
                                                        <span className={`badge ${item.status === "Published" ? "bg-green-500" : "bg-yellow-500"}`}>
                                                            {item.title}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        );
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>


                {/* Modals (Add Event, Edit Event & Add Access Token) */}
                <div className={`modal ${isModalVisible ? 'modal-open' : ''}`}>
                    <div className="modal-box">
                        <h2 className="font-bold text-lg">Add Event</h2>
                        <form onSubmit={handleAddEvent} className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formValues.title}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formValues.description}
                                    onChange={handleChange}
                                    className="textarea textarea-bordered"
                                    rows={4}
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Post Due Date</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="post_due_date"
                                    value={formValues.post_due_date}
                                    onChange={handleChange}
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Social Media Platform</span>
                                </label>
                                <select
                                    name="sm_platform"
                                    value={formValues.sm_platform}
                                    onChange={handleChange}
                                    className="select select-bordered"
                                    required
                                >
                                    <option value="Facebook">Facebook</option>
                                    <option value="Twitter">Twitter</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="TikTok">TikTok</option>
                                </select>
                            </div>
                            <div className="form-control">
                                <label className="cursor-pointer label">
                                    <span className="label-text">Auto Post?</span>
                                    <input
                                        type="checkbox"
                                        name="post_automatically"
                                        checked={formValues.post_automatically}
                                        onChange={handleChange}
                                        className="checkbox"
                                    />
                                </label>
                            </div>
                            <div className="modal-action">
                                <button type="submit" className="btn btn-primary">
                                    Add Event
                                </button>
                                <button type="button" className="btn" onClick={() => setIsModalVisible(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {isEventDetailsModalVisible && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4">Event Details</h2>
                            <form onSubmit={handleUpdateEvent} className="space-y-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Title</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formValues.title}
                                        onChange={handleChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Description</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formValues.description}
                                        onChange={handleChange}
                                        className="textarea textarea-bordered"
                                        rows={4}
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Post Due Date</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="post_due_date"
                                        value={formValues.post_due_date}
                                        onChange={handleChange}
                                        className="input input-bordered"
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Social Media Platform</span>
                                    </label>
                                    <select
                                        name="sm_platform"
                                        value={formValues.sm_platform}
                                        onChange={handleChange}
                                        className="select select-bordered"
                                        required
                                    >
                                        <option value="Facebook">Facebook</option>
                                        <option value="Twitter">Twitter</option>
                                        <option value="Instagram">Instagram</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                        <option value="TikTok">TikTok</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Status</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={formValues.status}
                                        onChange={handleChange}
                                        className="select select-bordered"
                                        required
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Published">Published</option>
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="cursor-pointer label">
                                        <span className="label-text">Auto Post?</span>
                                        <input
                                            type="checkbox"
                                            name="post_automatically"
                                            checked={formValues.post_automatically}
                                            onChange={handleChange}
                                            className="checkbox"
                                        />
                                    </label>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button type="submit" className="btn btn-primary">
                                        Update Event
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={handleDeleteEvent}>
                                        Delete Event
                                    </button>
                                    <button type="button" className="btn" onClick={() => setIsEventDetailsModalVisible(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {isAccessTokenModalVisible && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-xl font-bold mb-4">Add Access Token</h2>
                            <AddAccessToken />
                            <div className="flex justify-end mt-4">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setIsAccessTokenModalVisible(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
            <style jsx>{`
                .custom-calendar .ant-picker-cell-inner {
                    min-width: 120px; /* Adjust the width as needed */
                    white-space: nowrap;
                }
            `}</style>
        </>
    );
};

export default SMMCalendar;