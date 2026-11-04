export default function DiscussScreen({ onReveal, onQuit }) {
  return (
    <div className="screen discuss-screen">
      <button className="quit-btn" onClick={onQuit}>✕ Quit</button>
      <div className="discuss-center">
        <h2 className="discuss-title">Discussion Time 💬</h2>
        <p className="discuss-subtitle">Talk it out, then reveal when ready.</p>
        <button className="vote-btn" onClick={onReveal}>
          Reveal Sussy Baka 🎭
        </button>
      </div>
    </div>
  )
}
