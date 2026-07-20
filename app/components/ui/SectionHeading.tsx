interface SectionHeadingProps {
  badge?: string;
  title: string;
  description: string;
}

export default function SectionHeading({
  badge,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="mx-auto mb-16 max-w-3xl text-center">
      {badge && (
        <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-600">
          {badge}
        </span>
      )}

      <h2 className="mt-6 text-5xl font-bold text-gray-900">
        {title}
      </h2>

      <p className="mt-5 text-lg leading-8 text-gray-600">
        {description}
      </p>
    </div>
  );
}