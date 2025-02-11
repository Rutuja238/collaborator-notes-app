export default function NoteCard({ title, content }) {
    return (
      <div className="border p-4 rounded-md shadow-md">
        <h2 className="font-bold">{title}</h2>
        <p>{content}</p>
      </div>
    );
  }
