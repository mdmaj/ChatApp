import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider =({children})=>{

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); 
    const [unseenMessages, setUnseenMessages]= useState({})


    const {socket, axios} = useContext(AuthContext);

    // Funtion to get All Users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users || []);
                setUnseenMessages(data.unseenMessages || {});
            }
        } catch (error) {
            toast.error(error?.message || "Failed to fetch users");
        }
    };

    // Function to get messages for selected users
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages || []);
            }
        } catch (error) {
            toast.error(error?.message || "Failed to fetch messages");
        }
    };

    // Function to send Messages for selected Users
    const sendMessages = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            } else {
                toast.error(data.message || "Failed to send message");
            }
        } catch (error) {
            toast.error(error?.message || "Failed to send message");
        }
    };

    // Function to subscribe to messages for selected user
    const subscribeToMessages = async ()=>{
        if(!socket) return;
        socket.on("newMessage", (newMessage)=>{
                if (selectedUser && newMessage.senderId === selectedUser._id) {
                    newMessage.seen = true;
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                    axios.put(`/api/messages/mark/${newMessage._id}`);
                } else {
                    setUnseenMessages((prevUnseenMessages) => ({
                        ...prevUnseenMessages,
                        [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
                            ? prevUnseenMessages[newMessage.senderId] + 1
                            : 1,
                    }));
                }
        })
    }

    // Function to Unsubscribe from messages
    const unsubscribeFromMessages = async ()=>{
        if(socket) socket.off("newMessage")
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[socket,selectedUser])

    // When selected user changes, load their messages and clear unseen count
    useEffect(() => {
        const loadForSelected = async () => {
            if (selectedUser) {
                await getMessages(selectedUser._id);
                setUnseenMessages((prev) => ({ ...prev, [selectedUser._id]: 0 }));
            }
        };
        loadForSelected();
    }, [selectedUser]);

    const value = {
        messages,
        users,
        selectedUser,
        setSelectedUser,
        getUsers,
        getMessages,
        sendMessages,
        unseenMessages,
        setUnseenMessages,
    };
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )

}