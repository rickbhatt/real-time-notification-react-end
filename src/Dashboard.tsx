import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { BellIcon } from "lucide-react";
import { Button } from "./components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUnreadNotification,
  markNotificationAsRead,
} from "./apis/notifications";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const getNotifications = useQuery({
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
    console.log("marking notification as read");
    try {
      let response = await markNotificationAsRead();
    } catch (error: any) {
      console.log("🚀 ~ handleMarkNotificationAsRead: ~ error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <DropdownMenu
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          console.log(isOpen);
          if (isOpen) {
            console.log("button is clicked");
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
