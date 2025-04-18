import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bot, Send, User, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// Importar Socket.IO client
import { io, Socket } from "socket.io-client";
// Importar React Markdown para renderizar contenido en formato markdown
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Components } from "react-markdown";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  isLoading?: boolean;
}

// Definir tipos para las acciones de la API
interface ApiAction {
  type: string;
  endpoint: string;
  method: string;
  params?: Record<string, unknown>;
}

interface ApiResult {
  data?: unknown;
  message?: string;
  error?: string;
}

// Definir tipos para los eventos de Socket.IO
interface SocketEvents {
  start: { message: string };
  response: { message: string };
  action_start: { message: string; action: ApiAction };
  action_complete: { message: string; action: ApiAction; result: ApiResult };
  action_error: { message: string; action: ApiAction; error: ApiResult };
  complete: { message: string };
  error: { error: string; details: string };
}

interface TableData {
  headers: string[];
  rows: string[][];
  caption?: string;
}

// Función para detectar y parsear tablas en markdown
const parseMarkdownTable = (markdown: string): TableData[] => {
  const tables: TableData[] = [];
  const tableRegex =
    /(?:^|\n)(?:\|[^\n]*\|)\n\|(?:[-:| ]*\|)+\n((?:\|[^\n]*\|(?:\n|$))*)/g;
  const headerRegex = /\|(.*)\|/;
  const rowRegex = /\|([^\n]*)\|/g;

  let match;
  while ((match = tableRegex.exec(markdown)) !== null) {
    const tableLines = match[0].split("\n").filter((line) => line.trim());
    if (tableLines.length >= 2) {
      // Extraer encabezados
      const headerMatch = headerRegex.exec(tableLines[0]);
      const headers = headerMatch
        ? headerMatch[1]
            .split("|")
            .map((h) => h.trim())
            .filter((h) => h)
        : [];

      // Extraer filas
      const rows: string[][] = [];
      for (let i = 2; i < tableLines.length; i++) {
        const rowMatch = tableLines[i].match(rowRegex);
        if (rowMatch) {
          const row = rowMatch[0]
            .split("|")
            .slice(1, -1)
            .map((cell) => cell.trim());
          rows.push(row);
        }
      }

      // Buscar un título para la tabla
      let caption = "";
      const prevLine = markdown
        .split("\n")
        .slice(0, markdown.indexOf(match[0]))
        .reverse()
        .find((line) => line.trim().startsWith("##"));
      if (prevLine) {
        caption = prevLine.replace(/^#+\s+/, "").trim();
      }

      tables.push({ headers, rows, caption });
    }
  }
  return tables;
};

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const socketRef = useRef<Socket | null>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Custom styles for markdown content
  const markdownComponents: Components = {
    table: () => null, // Las tablas se manejarán de forma personalizada
    code({ className, children }) {
      const match = /language-(\w+)/.exec(className || "");
      const isDataVisualization = className?.includes("visualization");

      if (isDataVisualization) {
        return (
          <div className="bg-card border rounded-lg p-4 my-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart className="h-5 w-5 text-primary" />
              <span className="font-medium">Visualización de Datos</span>
            </div>
            <div className="bg-muted p-4 rounded">{children}</div>
          </div>
        );
      }

      if (!match) {
        return (
          <code className="bg-muted px-1.5 py-0.5 rounded-sm font-mono text-sm">
            {children}
          </code>
        );
      }

      return (
        <div className="relative group">
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(String(children));
              }}
            >
              Copiar
            </Button>
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            className="rounded-lg my-2 bg-muted"
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </div>
      );
    },
    th({ children }) {
      return (
        <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted">
          {children}
        </th>
      );
    },
    td({ children }) {
      return (
        <td className="px-4 py-2 whitespace-nowrap text-sm border-t">
          {children}
        </td>
      );
    },
    h1({ children }) {
      return (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-4">
          {children}
        </h1>
      );
    },
    h2({ children }) {
      return (
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 my-4">
          {children}
        </h2>
      );
    },
    h3({ children }) {
      return (
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight my-4">
          {children}
        </h3>
      );
    },
    ul({ children }) {
      return <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>;
    },
    blockquote({ children }) {
      return (
        <blockquote className="mt-6 border-l-2 pl-6 italic">
          {children}
        </blockquote>
      );
    },
  };

  // Inicializar Socket.IO al montar el componente
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    const token = localStorage.getItem("token");

    // Crear conexión Socket.IO
    const socket = io(baseUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    // Configurar manejadores de eventos
    socket.on("connect", () => {
      console.log("Conectado al servidor Socket.IO");
    });

    socket.on("start", (data: SocketEvents["start"]) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: data.message,
          sender: "assistant",
          timestamp: new Date(),
          isLoading: true,
        },
      ]);
    });

    socket.on("response", (data: SocketEvents["response"]) => {
      setMessages((prev) => {
        // Actualizar el último mensaje del asistente
        const updatedMessages = [...prev];
        const lastAssistantIndex = updatedMessages.findIndex(
          (msg) => msg.sender === "assistant" && msg.isLoading
        );

        if (lastAssistantIndex !== -1) {
          updatedMessages[lastAssistantIndex] = {
            ...updatedMessages[lastAssistantIndex],
            content: data.message,
            isLoading: false,
          };
        } else {
          // Si no hay un mensaje de carga, crear uno nuevo
          updatedMessages.push({
            id: Date.now().toString(),
            content: data.message,
            sender: "assistant",
            timestamp: new Date(),
          });
        }

        return updatedMessages;
      });
    });

    socket.on("action_start", (data: SocketEvents["action_start"]) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: data.message,
          sender: "assistant",
          timestamp: new Date(),
          isLoading: true,
        },
      ]);
    });

    socket.on("action_complete", (data: SocketEvents["action_complete"]) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: `Acción completada: ${data.message}`,
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    });

    socket.on("action_error", (data: SocketEvents["action_error"]) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: `Error: ${data.message}`,
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    });

    socket.on("complete", (data: SocketEvents["complete"]) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: data.message,
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    });

    socket.on("error", (data: SocketEvents["error"]) => {
      toast({
        title: "Error",
        description: data.error || "Error desconocido",
        variant: "destructive",
      });
      setIsLoading(false);
    });

    socket.on("disconnect", () => {
      console.log("Desconectado del servidor Socket.IO");
    });

    // Limpiar al desmontar
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [toast]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !socketRef.current) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Enviar mensaje a través de Socket.IO
    const token = localStorage.getItem("token");
    const userId = token ? JSON.parse(atob(token.split(".")[1])).id : undefined;

    socketRef.current.emit("chat_message", {
      message: inputMessage,
      userId,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: Message) => {
    if (message.sender === "user") {
      return (
        <div className="bg-primary text-primary-foreground rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4" />
            <span className="text-xs font-medium">Tú</span>
            <span className="text-xs opacity-70 ml-auto">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
          <p>{message.content}</p>
        </div>
      );
    }

    // Procesar el contenido para extraer tablas
    const tables = parseMarkdownTable(message.content);
    const contentWithoutTables = message.content.replace(
      /(?:^|\n)(?:\|[^\n]*\|)\n\|(?:[-:| ]*\|)+\n((?:\|[^\n]*\|(?:\n|$))*)/g,
      ""
    );

    return (
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="h-4 w-4" />
          <span className="text-xs font-medium">Asistente</span>
          <span className="text-xs opacity-70 ml-auto">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <ReactMarkdown components={markdownComponents}>
            {contentWithoutTables}
          </ReactMarkdown>

          {tables.map((table, index) => (
            <div key={index} className="my-4">
              <Table>
                {table.caption && (
                  <TableCaption className="text-base font-medium mb-2">
                    {table.caption}
                  </TableCaption>
                )}
                <TableHeader>
                  <TableRow>
                    {table.headers.map((header, i) => (
                      <TableHead
                        key={i}
                        className={
                          header.toLowerCase().includes("monto") ||
                          header.toLowerCase().includes("total")
                            ? "text-right"
                            : undefined
                        }
                      >
                        {header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell
                          key={cellIndex}
                          className={
                            table.headers[cellIndex]
                              ?.toLowerCase()
                              .includes("monto") ||
                            table.headers[cellIndex]
                              ?.toLowerCase()
                              .includes("total")
                              ? "text-right tabular-nums"
                              : undefined
                          }
                        >
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
        {message.isLoading && (
          <div className="flex items-center gap-2 mt-2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            <span className="text-sm">Procesando...</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="h-[calc(100vh-200px)] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Asistente Virtual
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
          <div className="space-y-6">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-lg font-medium mb-2">
                  ¡Bienvenido al Asistente Virtual! 👋
                </p>
                <p className="text-sm">Puedes preguntarme sobre:</p>
                <ul className="text-sm mt-2 space-y-1">
                  <li>• Productos y su inventario</li>
                  <li>• Ventas y estadísticas</li>
                  <li>• Clientes y proveedores</li>
                  <li>• Reportes y análisis</li>
                </ul>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="max-w-[85%]">{renderMessage(message)}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="flex w-full gap-2">
            <Input
              placeholder="Escribe tu mensaje..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-4"
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
