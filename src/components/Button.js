/*
    https://tailwindcss.com/docs/width
    https://tailwindcss.com/docs/background-color
    https://tailwindcss.com/docs/box-shadow
    https://tailwindcss.com/docs/flex-direction
    https://tailwindcss.com/docs/hover-focus-and-other-states
    
    https://tailwindcss.com/docs/text-align
  */

export default function Button({ children, type = 'primary', href, onClick}) {
  const base = "py-3 px-8 rounded-lg font-medium transition-colors text-white"
  const styles = {
    primary: "bg-blue-600 hover:bg-blue-700",
    secondary: "bg-gray-600 hover:bg-gray-700"
  }

  if (href) {
    return (
      <a href={href} className={`${base} ${styles[type]}`}>
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={`${base} ${styles[type]}`}>
      {children}
    </button>
  )
}