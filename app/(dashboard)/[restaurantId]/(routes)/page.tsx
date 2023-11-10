import Heading from '@/components/Global/heading'
import { Separator } from '@/components/ui/separator'

const DashboardPage = async () => {
    return (
        <main className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title="Dashboard" description="Overview of your restaurant." />
                <Separator />

                <p className='py-2'>Charts and analytics are coming soon!</p>
            </div>
        </main>
    )
}

export default DashboardPage
