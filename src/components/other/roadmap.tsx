import type React from "react";

export interface RoadmapProps {
  title: string;
  description: string;
  status: "completed" | "inProgress" | "notStarted" | "planned";
}

interface RoadmapComponentProps {
  items: RoadmapProps[];
  title?: string;
}

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
    <div className="not-prose font-mono">
      <div className="flex flex-col gap-6">
        {items.map((item, index) => (
          <div className="flex flex-col gap-2" key={index}>
            <div className="flex items-center gap-3">
              <div
                className={`h-2 w-2 shrink-0 rounded-card ${getStatusColor(
                  item.status,
                )}`}
              />
              <h3 className="font-medium text-lg">{item.title}</h3>
            </div>
            <div className="ml-6 flex flex-col gap-1">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
              <p
                className={`font-medium text-xs ${
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
