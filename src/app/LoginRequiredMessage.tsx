import { routes } from "../router"
import { solidButton } from "../ui/components"
import IslandLayout from "../ui/IslandLayout"

export default function LoginRequiredMessage() {
  return (
    <IslandLayout title="Login required" isVisible>
      <div className="flex flex-col items-center gap-4 p-4">
        <p>You must be logged in to see this page.</p>
        <a className={solidButton} {...routes.login().link}>
          Return to Login
        </a>
      </div>
    </IslandLayout>
  )
}
