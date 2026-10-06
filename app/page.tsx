import { cvUpdated } from '@/cv/updated'
import Workbench from '@/workbench/Workbench'

export default async function Home() {
  return <Workbench cvUpdated={await cvUpdated()} />
}
