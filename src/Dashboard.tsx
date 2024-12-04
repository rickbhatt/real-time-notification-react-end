import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { BellIcon } from "lucide-react";
import { useState } from "react";
import {
  getUnreadNotification,
  markNotificationAsRead,
} from "./apis/notifications";
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import useWebSocket from "react-use-websocket";

interface Notification {
  id: string;
  title: string;
  message: string;
  status: string;
  created_at: string;
}

const Dashboard = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const WEBSOCKET_URL = `ws://127.0.0.1:8000/ws/notifications/`;

  useWebSocket(WEBSOCKET_URL, {
    onOpen: () => {
      console.log("websocket connected to notifications");
    },
    onClose: () => {
      console.log("websocket closed");
    },
    onError: (error) => {
      console.error("WebSocket error:", error);
    },
    onMessage: (event) => {
      let notificationMessage = JSON.parse(event.data);

      setNotifications((prev) => [notificationMessage, ...prev]);
    },
  });

  useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        let response = await getUnreadNotification();

        setNotifications(response.data);
        return response.data;
      } catch (error: any) {
        console.log("🚀 ~ queryFn: ~ error:", error);
      }
    },
    refetchOnWindowFocus: false,
  });

  const handleMarkNotificationAsRead = async () => {
    try {
      await markNotificationAsRead();
    } catch (error: any) {
      console.log("🚀 ~ handleMarkNotificationAsRead: ~ error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <DropdownMenu
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);

          if (isOpen) {
            handleMarkNotificationAsRead();
          } else {
            setNotifications([]);
          }
        }}
      >
        <DropdownMenuTrigger>
          <div className="relative">
            <Button className="h-10 w-10 rounded-full">
              <BellIcon size={25} />
            </Button>
            {notifications.length > 0 && (
              <Badge
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0"
                variant="destructive"
              >
                {notifications.length > 99 ? "99+" : notifications.length}
              </Badge>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {notifications.length > 0 ? (
            notifications.map((notification: any) => (
              <DropdownMenuItem key={notification.id}>
                <div className="flex flex-col">
                  <p className="font-bold">{notification.title}</p>
                  <p className="text-sm">{notification.message}</p>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem>No new notifications</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Dashboard;
