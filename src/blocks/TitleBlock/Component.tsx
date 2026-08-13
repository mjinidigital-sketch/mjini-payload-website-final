import Title from '@/components/Title'

export const TitleBlockComponent = (props: any) => {
  const { title, subTitle, description } = props
  return (
    <div className="container mx-auto mt-12 md:mt-16 lg:mt-20 ">
      <Title
        title={title as string}
        subTitle={subTitle as string}
        description={description as string}
      />
    </div>
  )
}
