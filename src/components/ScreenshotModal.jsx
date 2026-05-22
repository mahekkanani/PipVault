import Modal from './Modal.jsx';

export default function ScreenshotModal({ screenshot, onClose }) {
  if (!screenshot) return null;

  return (
    <Modal title="Trade Screenshot" onClose={onClose} size="max-w-5xl">
      <img
        src={screenshot}
        alt="Trade screenshot preview"
        className="mx-auto max-h-[75vh] rounded-lg border border-zinc-800 object-contain"
      />
    </Modal>
  );
}
