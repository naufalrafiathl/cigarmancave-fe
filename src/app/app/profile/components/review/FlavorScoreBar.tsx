export const FlavorScoreBar: React.FC<{ score: number }> = ({ score }) => {
    return (
      <div className="w-24 bg-gray-700 rounded-full h-2">
        <div
          className="bg-[#EFA427] h-2 rounded-full"
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
    );
  };