export default function ErrorViewer({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={`p-2 rounded-md bg-red-50 border-2 border-red-200 text-red-600 ${className}`}
      {...props}
    />
  );
}
