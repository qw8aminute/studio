import './Card.css';

interface CardProps {
  src: string;
  alt?: string;
}

export default function Card({ src, alt = '' }: CardProps) {
  return (
    <div className="card-wrapper">
      <img src={src} alt={alt} draggable={false} />
      <div className="duotone-filter" />
    </div>
  );
}
