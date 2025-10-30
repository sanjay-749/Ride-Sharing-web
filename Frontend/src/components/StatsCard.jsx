import React from "react";

const StatsCard = ({ title, value, icon: Icon, color = "violet", description }) => {
  const colorClasses = {
    violet: "bg-violet-50 text-violet-600 border-violet-200",
    green: "bg-green-50 text-green-600 border-green-200",
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200"
  };

  const bgColorClasses = {
    violet: "bg-violet-100",
    green: "bg-green-100",
    orange: "bg-orange-100",
    purple: "bg-purple-100",
    blue: "bg-blue-100"
  };

  return (
    <div className={`violet-card border-l-4 ${colorClasses[color]} p-6 transition-all duration-300 hover:transform hover:-translate-y-1`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${bgColorClasses[color]} ml-4`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;