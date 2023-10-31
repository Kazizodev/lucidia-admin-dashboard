"use client"
import { useParams } from "next/navigation"
import { useOrigin } from "@/hooks/use-origin"
import ApiAlert from "@/components/Global/api-alert"

interface ApiListProps {
  entityName: string
  entityIdName: string
}

const ApiList: React.FC<ApiListProps> = ({ entityIdName, entityName }) => {
  const params = useParams()
  const origin = useOrigin()

  const baseUrl = `${origin}/api/${params.restaurantId}`
  return (
    <>
      <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}`} />
      <ApiAlert title="GET" variant="public" description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
      <ApiAlert title="POST" variant="admin" description={`${baseUrl}/${entityName}`} />
      <ApiAlert title="PATCH" variant="admin" description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
      <ApiAlert title="DELETE" variant="admin" description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
    </>
  )
}

export default ApiList
