

export const ErrorMessage = ({ error }: { error?: any }) => {
    if (!error) return null
    return (
        <span className="text-red-600 text-sm">{error} </span>
    )
}

export default ErrorMessage