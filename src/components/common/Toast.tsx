export default function Toast({ toast, onClose }: any) {
    return (
        <div className={`toast ${toast.type || ''}`}>
            <span>{toast.message}</span>
            <span className="toast-close" onClick={onClose}>×</span>
        </div>
    )
}
