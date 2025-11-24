export default function TimelineCard({
  time,
  title,
  description,
  image,
  link,
}: any) {
  return (
    <div className="glass-card p-4 rounded-2xl shadow-lg text-blue-700">

      {/* Image */}
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover rounded-xl mb-3"
        />
      )}

      {/* Time */}
      <p className="text-sm font-semibold text-blue-400 mb-1">{time}</p>

      {/* Title */}
      <h3 className="text-lg font-bold text-blue-900 mb-1">{title}</h3>

      {/* Description */}
      <p className="text-blue-700/90 mb-3">{description}</p>

      {/* Link */}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 font-semibold underline"
        >
          Open Link →
        </a>
      )}
    </div>
  );
}
