import React from "react"; // External imports

// Interfaces
export interface RoadmapProps {
  title: string;
  description: string;
  status: "completed" | "inProgress" | "notStarted" | "planned";
}

interface RoadmapComponentProps {
  items: RoadmapProps[];
  title?: string;
}

// Component
const RoadmapComponent: React.FC<RoadmapComponentProps> = ({
  items,
  title = "Roadmap",
}) => {
  const getStatusColor = (status: RoadmapProps["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "inProgress":
        return "bg-blue-500";
      case "notStarted":
        return "bg-gray-500";
      case "planned":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: RoadmapProps["status"]) => {
    switch (status) {
      case "completed":
        return "done";
      case "inProgress":
        return "in progress";
      case "notStarted":
        return "not started";
      case "planned":
        return "planned";
      default:
        return "unknown";
    }
  };

  return (
    <div className="font-mono not-prose">
      <div className="flex flex-col gap-6">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(
                  item.status,
                )}`}
              ></div>
              <h3 className="text-lg font-medium">{item.title}</h3>
            </div>
            <div className="flex flex-col gap-1 ml-6">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
              <p
                className={`text-xs font-medium ${
                  item.status === "completed"
                    ? "text-green-400"
                    : item.status === "inProgress"
                      ? "text-blue-400"
                      : item.status === "planned"
                        ? "text-yellow-400"
                        : "text-gray-400"
                }`}
              >
                {getStatusText(item.status)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { RoadmapComponent };
