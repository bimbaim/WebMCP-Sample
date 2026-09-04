"use client";

import { useState, useRef, useEffect } from "react";
import { parseChatInput, type ParsedCommand } from "@/lib/chatParser";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
};

const PRESET_QUESTIONS = [
  { label: "🔍 Search wireless headphones", query: "Search wireless" },
  { label: "🛍️ Show all electronics", query: "Show electronics" },
  { label: "👗 Show fashion items", query: "Show fashion" },
  { label: "🏠 Show home & living", query: "Show home" },
  { label: "💰 Find affordable products", query: "Search affordable" },
  { label: "⭐ Show top rated items", query: "Search rated" },
];

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hi! I'm ShopMCP Assistant. I can help you search products, filter by category, and show product details.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPresets, setShowPresets] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const rect = dragRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.width / 2,
        y: e.clientY - rect.height / 2,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setShowPresets(false);

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Parse user input
      const command = parseChatInput(input);

      // Call API
      const response = await fetch("/api/mcp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "tools/call",
          params: {
            name: command.tool,
            arguments: command.args,
          },
          id: Date.now(),
        }),
      });

      const result = await response.json();

      // Parse response
      let botResponse = "";
      if (result.result?.content?.[0]?.text) {
        const text = result.result.content[0].text;
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            // Search results
            botResponse = parsed
              .map(
                (p: any) =>
                  `📦 ${p.name} - $${p.price} ⭐ ${p.rating}`
              )
              .join("\n");
          } else if (parsed.name) {
            // Product detail
            botResponse = `📦 ${parsed.name}\n💰 $${parsed.price}\n⭐ ${parsed.rating}\n📊 ${parsed.stock} in stock\n📝 ${parsed.description}`;
          } else {
            botResponse = JSON.stringify(parsed, null, 2);
          }
        } catch {
          botResponse = text;
        }
      } else {
        botResponse = "Sorry, I couldn't process that. Try: 'search wireless' or 'show electronics'";
      }

      // Add bot message
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: botResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handlePresetQuestion = (query: string) => {
    setInput(query);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center text-2xl hover:scale-110 active:scale-95"
        title="Open chat"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          ref={dragRef}
          className="fixed bottom-24 right-6 z-40 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200 overflow-hidden"
          style={
            isDragging
              ? {
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  cursor: "grabbing",
                }
              : {}
          }
        >
          {/* Header */}
          <div
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 flex items-center justify-between cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <div>
                <h3 className="font-bold">ShopMCP</h3>
                <p className="text-xs opacity-90">Product Assistant</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Preset Questions */}
            {showPresets && messages.length === 1 && (
              <div className="space-y-2 mt-4">
                <p className="text-xs text-gray-500 font-medium px-2">💡 Quick suggestions:</p>
                <div className="flex flex-col gap-2">
                  {PRESET_QUESTIONS.map((question) => (
                    <button
                      key={question.query}
                      onClick={() => handlePresetQuestion(question.query)}
                      className="w-full px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors cursor-pointer border border-emerald-200 text-left active:scale-95"
                    >
                      {question.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-500">
                  Thinking... 💭
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me..."
                disabled={loading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                →
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Try: "search wireless" • "show electronics"
            </p>
          </form>
        </div>
      )}
    </>
  );
}
