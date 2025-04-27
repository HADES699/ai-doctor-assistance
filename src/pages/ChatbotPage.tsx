import { useState, useEffect, useRef } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, RefreshCw } from "lucide-react"; // Added RefreshCw icon for New Chat
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
const ChatbotPage = () => {
  const { user } = useAuth();
  const SERVER_URL = import.meta.env.VITE_OPENAI_SERVER_URL;
  const [messages, setMessages] = useState<
    {
      content: string;
      role: "user" | "assistant";
      timestamp: string;
    }[]
  >([
    {
      content: "Hello! I'm your AI Doctor Assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<{
    full_name: string;
    age?: number;
    gender?: string;
  } | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, age, gender")
          .eq("id", user.id)
          .single();
        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Failed to load profile data");
        } else {
          setProfile(data);
        }
      }
    };
    fetchProfile();
  }, [user]);

  // Load chat history
  useEffect(() => {
    const fetchHistory = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("chat_history")
          .select("role, content, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });
        if (error) {
          console.error("Error fetching chat history:", error);
          toast.error("Failed to load chat history");
        } else if (data) {
          setMessages((prevMessages) => [
            prevMessages[0], // Keep initial assistant message
            ...data.map((msg) => ({
              content: msg.content,
              role: msg.role as "user" | "assistant",
              timestamp: new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            })),
          ]);
        }
      }
    };
    fetchHistory();
  }, [user]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle New Chat
  const handleNewChat = async () => {
    if (user) {
      // Clear chat history from Supabase
      const { error } = await supabase
        .from("chat_history")
        .delete()
        .eq("user_id", user.id);
      if (error) {
        console.error("Error clearing chat history:", error);
        toast.error("Failed to clear chat history");
        return;
      }
    }

    // Reset messages to initial state
    setMessages([
      {
        content:
          "Hello! I'm your AI Doctor Assistant. How can I help you today?",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setInputValue("");
    toast.success("Started a new chat!");
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const newUserMessage = {
      content: inputValue,
      role: "user" as const,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      if (!user) {
        toast.error("You need to be logged in to use the chatbot");
        setIsLoading(false);
        return;
      }

      // Get session for access token
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        toast.error("You need to be logged in to use the chatbot");
        setIsLoading(false);
        return;
      }
      const accessToken = sessionData.session.access_token;

      // Call Node.js server
      const response = await fetch(`${SERVER_URL}/ai-analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          prompt: inputValue,
          type: "chat",
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get AI response: ${response.statusText}`);
      }

      const data = await response.json();

      // Save user message to database
      const { error: userMessageError } = await supabase
        .from("chat_history")
        .insert([{ role: "user", content: inputValue, user_id: user.id }]);
      if (userMessageError) {
        console.error("Error saving user message:", userMessageError);
      }

      // Create AI response message
      const newAIMessage = {
        content: data.generatedText,
        role: "assistant" as const,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      // Save AI response to database
      const { error: aiMessageError } = await supabase
        .from("chat_history")
        .insert([
          { role: "assistant", content: data.generatedText, user_id: user.id },
        ]);
      if (aiMessageError) {
        console.error("Error saving AI message:", aiMessageError);
      }

      setMessages((prevMessages) => [...prevMessages, newAIMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get a response. Please try again.");

      const errorMessage = {
        content:
          "I'm sorry, I couldn't process your request. Please try again later.",
        role: "assistant" as const,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const commonTopics = [
    "Headaches & Migraines",
    "Cold & Flu Symptoms",
    "Allergies",
    "Stomach Issues",
    "Sleep Problems",
    "Skin Rashes",
    "Joint Pain",
    "Breathing Difficulties",
  ];

  const handleTopicClick = (topic: string) => {
    setInputValue(`I have questions about ${topic}`);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Chat Bot / General Care</h1>
            <Button
              onClick={handleNewChat}
              className=" hover:bg-gray-600"
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
          <p className="text-gray-600 mb-8">
            Talk to our AI assistant about general health concerns and get
            instant guidance
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <Card className="md:col-span-1">
              <CardContent className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4">Patient Info</h2>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="font-medium">
                        Name: {profile?.full_name || "Guest User"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">
                        Age: {profile?.age || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">
                        Gender:{" "}
                        {profile?.gender?.charAt(0).toUpperCase() +
                          (profile?.gender?.slice(1) || "Not specified")}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4">Common Topics</h2>
                  <div className="space-y-2">
                    {commonTopics.map((topic, index) => (
                      <button
                        key={index}
                        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md text-sm font-medium transition-colors"
                        onClick={() => handleTopicClick(topic)}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Chat Area */}
            <Card className="md:col-span-3 flex flex-col h-[600px]">
              <CardContent className="p-6 flex flex-col h-full">
                {/* Scrollable Messages */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                >
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 break-words ${
                          message.role === "user"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <div className="text-sm">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            message.role === "user"
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {message.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fixed Input Section */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Type your health concern..."
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-primary hover:bg-primary/90"
                    disabled={isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatbotPage;
