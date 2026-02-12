

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="stats shadow bg-base-100 border border-base-200">
      <div className="stat">
        <div className={`stat-figure ${color}`}>
          <Icon size={32} />
        </div>
        <div className="stat-title">{title}</div>
        <div className={`stat-value ${color}`}>{value}</div>
      </div>
    </div>
  );
};

export default StatCard;