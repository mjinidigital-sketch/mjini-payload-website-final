export default function Title({
  title,
  subTitle,
  description,
}: {
  title: string
  subTitle?: string
  description?: string
  className?: string
}) {
  return (
    <>
      {/* Header */}
      <div className="mx-auto max-w-5xl px-4 text-left md:text-center">
        {/* Main Heading */}
        <h2 className="mb-4 text-balance text-4xl font-extrabold tracking-tight text-foreground md:text-5xl ">
          {title}
        </h2>

        {/* Small Heading */}
        <h3 className="mb-3 text-xl font-semibold uppercase tracking-[0.1em] text-primary">
          {subTitle}
        </h3>

        {/* Decorative Divider */}
        <div className="my-5 flex md:justify-center">
          <hr className="h-1 w-1/3 rounded-full border-0 bg-accent" />
        </div>

        {/* Description */}
        <p className="mx-auto max-w-5xl text-pretty text-lg leading-8 text-muted-foreground md:text-xl">
          {description}
        </p>
      </div>
    </>
  )
}
