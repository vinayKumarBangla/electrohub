type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({
  children,
  type = "button",
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
w-full
rounded-2xl
bg-gradient-to-r
from-blue-600
to-indigo-600
px-6
py-3.5
font-semibold
text-white
transition-all
duration-300
hover:from-blue-700
hover:to-indigo-700
hover:shadow-[0_10px_30px_rgba(37,99,235,0.35)]
hover:-translate-y-0.5
active:translate-y-0
active:scale-[0.98]
disabled:cursor-not-allowed
disabled:opacity-50
"
    >
      {children}
    </button>
  );
}