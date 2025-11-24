export default function IdeaCard({ title, description, image, link }: any) {
  return (
    <div className="glass-card p-4 rounded-2xl shadow-lg text-blue-400">
      
      {/* Card Image */}
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover rounded-xl mb-3"
        />
      )}

      {/* Title */}
      <h3 className="text-xl font-semibold text-blue-900 mb-1">
        {title}
      </h3>

      {/* Description */}
      <p className="text-blue-400/90 mb-3">{description}</p>

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
